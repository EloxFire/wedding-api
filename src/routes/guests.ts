import express, { Request, Response }  from 'express';
import mongoose from "mongoose";
import Guest from "../schemas/Guest";
const router = express.Router();

// @route GET /guests
// @desc Get all guests invited to the wedding
// @access Public
router.get("/", async (req: Request, res: Response) => {
  console.log("GET /guests");
  try {
    const guests = await Guest.find();
    res.status(200).json({guests: guests});
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error });
  }
})

// @route POST /guests
// @desc Add a new guest to the wedding guest list
// @access Public
router.post("/", async (req: Request, res: Response) => {
  console.log("POST /guests");
  try {
    const body = req.body as unknown;

    if (Array.isArray(body)) {
      if (body.length === 0) {
        res.status(400).json({ message: "No guests provided" });
        return;
      }
      const guests = await Guest.insertMany(body);
      res.status(201).json({ guests });
      return;
    }

    if (typeof body === "object" && body !== null && Array.isArray((body as any).guests)) {
      const guestsPayload = (body as any).guests;
      if (guestsPayload.length === 0) {
        res.status(400).json({ message: "No guests provided" });
        return;
      }
      const guests = await Guest.insertMany(guestsPayload);
      res.status(201).json({ guests });
      return;
    }

    const newGuest = new Guest(body);
    await newGuest.save();
    res.status(201).json({ guest: newGuest });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

// @route POST /guests/:id/family-members
// @desc Add an array of family member ids to a guest
// @access Public
router.post("/:id/family-members", async (req: Request, res: Response) => {
  const guestId = req.params.id;
  console.log(`POST /guests/${guestId}/family-members`);

  try {
    const body = req.body as unknown;
    const familyMembers = Array.isArray(body)
      ? body
      : Array.isArray((body as any).family_members)
        ? (body as any).family_members
        : Array.isArray((body as any).familyMembers)
          ? (body as any).familyMembers
          : null;

    if (!familyMembers || familyMembers.length === 0) {
      res.status(400).json({ message: "No family members provided" });
      return;
    }

    const guest = await Guest.findById(guestId);

    if (!guest) {
      res.status(404).json({ message: "Guest not found" });
      return;
    }

    const mergedFamily = Array.from(
      new Set([...(guest.family_members || []), ...familyMembers.map(String)])
    );
    guest.family_members = mergedFamily;
    await guest.save();

    res.status(200).json({ guest });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

// @Route GET /guests/id/family
// @desc Get all family members of a guest by guest ID, this return full guest objects in an array
// @access Public
router.get("/:id/family", async (req: Request, res: Response) => {
  const guestId = req.params.id;
  console.log(`GET /guests/${guestId}/family`);

  try {
    const guest = await Guest.findById(guestId);

    if (!guest) {
      res.status(404).json({ message: "Guest not found" });
      return;
    }

    const familyMembers = await Guest.find({
      _id: { $in: guest.family_members || [] }
    });

    res.status(200).json({ familyMembers });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

// @route PATCH /guests/:ids
// @desc Update guest RSVP responses for listed guest IDs
// @access Public
router.patch("/:ids", async (req: Request, res: Response) => {
  const idsParam = req.params.ids;
  console.log(`PATCH /guests/${idsParam}`);

  try {
    const ids = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (!ids.length) {
      res.status(400).json({ message: "No valid guest IDs provided" });
      return;
    }

    const body = req.body as unknown;
    const guestsPayload = Array.isArray(body)
      ? body
      : Array.isArray((body as any).guests)
        ? (body as any).guests
        : null;

    if (!guestsPayload || !guestsPayload.length) {
      res.status(400).json({ message: "No guests provided" });
      return;
    }

    const updates = guestsPayload
      .map((guest: any) => {
        const id = String(guest?._id || guest?.id || "").trim();
        if (!id || !ids.includes(id) || !mongoose.Types.ObjectId.isValid(id)) {
          return null;
        }

        return {
          updateOne: {
            filter: { _id: new mongoose.Types.ObjectId(id) },
            update: {
              confirmed_town_hall: guest.confirmed_town_hall,
              confirmed_brunch: guest.confirmed_brunch,
              notes: guest.notes ?? null,
              selected_meal: guest.selected_meal ?? null,
              selected_music: guest.selected_music ?? null,
            },
          },
        };
      })
      .filter(Boolean) as any[];

    if (!updates.length) {
      res.status(400).json({ message: "No matching guests to update" });
      return;
    }

    await Guest.bulkWrite(updates, { ordered: false });
    const updatedGuests = await Guest.find({ _id: { $in: ids } });

    res.status(200).json({ guests: updatedGuests });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

// @route GET /guests/:search
// @desc Search for guests by firstname or lastname
// @access Public
router.get("/:search", async (req: Request, res: Response) => {
  const searchParam = req.params.search;
  console.log(`GET /guests/${searchParam}`);
  try {
    const regex = new RegExp(searchParam, 'i'); // Case-insensitive search
    const guests = await Guest.find({
      $or: [
        { firstname: { $regex: regex } },
        { lastname: { $regex: regex } }
      ]
    });

    if (!guests.length) {
      res.status(404).json({ message: "Guest not found" });
      return;
    }

    res.status(200).json({ guests });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});


module.exports = router;
