import { redis } from "../redisConnection.js";
import { Url } from "../models/url.model.js";
import base62 from "base62";

async function getCounter() {
  try {
      const { code } = await Url.findOne({}, { _id: 0, code: 1 }).sort({ timestamp: -1 });
      const counter = base62.decode(code) + 1;
      console.log(typeof counter, counter);
      return counter;
  } catch (error) {
      console.log("could't find counter", error.message);
  }
}

const generateShortUrl = async (req, res) => {
  try {
    const user = req.user;
    const { longUrl, title } = req.body;

    let counter = Number(await redis.get("counter"));

    if (!counter) {
      counter = await getCounter();
    }

    await redis.set("counter", counter + 1);

    console.log(counter);

    const code = base62.encode(counter);

    const url = new Url({ code, longUrl, title });

    await url.save();

    user.urls.push(url._id);

    await user.save();

    const apiUrl = "https://link-shrinker-gc27.onrender.com";

    const shortUrl = `${apiUrl}/${code}`;

    console.log(shortUrl);

    res.status(201).json({ shortUrl });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const getLongUrl = async (req, res) => {
  try {
    const code = req.params.code;

    const urlFromRedis = await redis.get(code);
    if (urlFromRedis) {
      console.log(`caching hitting for code:${code}`);
      return res.status(301).redirect(urlFromRedis);
    }

    console.log(`caching missing for code:${code}`);

    const url = await Url.findOne({ code });

    if (!url) {
      res.status(404).json({ msg: "Invalid ShortUrl" });
    } else {
      await redis.set(code, url.longUrl);
      res.status(302).redirect(url.longUrl);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getUrls = async (req, res) => {
  try {
    const user = req.user;
    const urls = await Url.aggregate([
      {
        $match: {
          _id: { $in: user.urls },
        },
      },
      {
        $addFields: {
          shortUrl: {
            $concat: ["https://link-shrinker-gc27.onrender.com/", "$code"],
          },
        },
      },
      {
        $project: {
          _id: 0,
          code: 0,
        },
      },
    ]);

    res.status(200).json({ name: user.name, urls });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ sucess: false, message: "Something went wrong" });
  }
};

export { generateShortUrl, getLongUrl, getUrls };
