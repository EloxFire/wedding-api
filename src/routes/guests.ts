import express, { Request, Response }  from 'express';
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

module.exports = router;
