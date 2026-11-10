const { Router } = require("express");
const router = Router();

const { getVideoOffers } = require("./Video/allSubscriptions");
const { getVideoNamesAndPrices } = require("./Video/nameAndPrice");

const { getMusicOffers } = require("./Music/allSubscriptions");
const { getMusicNamesAndPrices } = require("./Music/nameAndPrice");

const { getLanguageOffers } = require("./Language/allSubscriptions");
const { getLanguageNamesAndPrices } = require("./Language/nameAndPrice");

const { getEBookOffers } = require("./EBook/allSubscriptions");
const { getEBookNamesAndPrices } = require("./EBook/nameAndPrice");

const { getDatingOffers } = require("./Dating/allSubscriptions");
const { getDatingNamesAndPrices } = require("./Dating/nameAndPrice");

const { getAudioBookOffers } = require("./AudioBook/allSubscriptions");
const { getAudioBookNamesAndPrices } = require("./AudioBook/nameAndPrice");

/* 
Erste Möglichekit - mehr Code, aber einfacher 
router.get("/video", async (req, res) => {
    try {
        const offers = await getVideoOffers();
        res.json(offers);
    } catch (err) {
        res.status(500).json({ error: "Scraping failed" });
    }
});

*/

const nameAndPriceHandlers = {
    video:     getVideoNamesAndPrices,
    music:     getMusicNamesAndPrices,
    language:  getLanguageNamesAndPrices,
    ebook:     getEBookNamesAndPrices,
    dating:    getDatingNamesAndPrices,
    audiobook: getAudioBookNamesAndPrices,
};

router.get("/:category/nameandprice", async (req, res) => {
    const handler = nameAndPriceHandlers[req.params.category];

    if (!handler) {
        return res.status(404).json({ error: "Unknown category" });
    }

    try {
        const data = await handler();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Scraping failed" });
    }
});


const offerHandlers = {
    video:      getVideoOffers,
    music:      getMusicOffers,
    language:   getLanguageOffers,
    ebook:      getEBookOffers,
    dating:     getDatingOffers,
    audiobook:  getAudioBookOffers,
};

router.get("/:category", async (req, res) => {
    const handler = offerHandlers[req.params.category]; 

    if (!handler) {
        return res.status(404).json({ error: "Unknown category" });
    }

    try {
        const offers = await handler();
        res.json(offers);
    } catch (err) {
        res.status(500).json({ error: "Scraping failed" });
    }
});

module.exports = router;