import * as cheerio from 'cheerio';

const response = await fetch('https://www.abo24.de/musik_streaming-abo-vergleich');
const html = await response.text();
const $ = cheerio.load(html);



const deezerOffers = $('td[data-column="1"] a.offer-list-link')
    .map((_, el) => {
        const name = $(el).find('strong').text().trim();
        const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const amazonMusicUnlimitedOffers = $('td[data-column="2"] a.offer-list-link')
    .map((_, i) => {
        const name = $(i).find('strong').text().trim();
        const price = $(i).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();

const appleMusicOffers = $('td[data-column="3"] a.offer-list-link')
    .map((_, y) => {
        const name = $(y).find('strong').text().trim();
        const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const spotifyOffers = $('td[data-column="4"] a.offer-list-link')
    .map((_, y) => {
        const name = $(y).find('strong').text().trim();
        const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const qobuzOffers = $('td[data-column="5"] a.offer-list-link')
    .map((_, y) => {
        const name = $(y).find('strong').text().trim();
        const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const soundcloudGoOffers = $('td[data-column="6"] a.offer-list-link')
    .map((_, y) => {
        const name = $(y).find('strong').text().trim();
        const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const napsterOffers = $('td[data-column="7"] a.offer-list-link')
    .map((_, y) => {
        const name = $(y).find('strong').text().trim();
        const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();

const youtubeMusicOffers = $('td[data-column="8"] a.offer-list-link')
    .map((_, y) => {
        const name = $(y).find('strong').text().trim();
        const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();

const tidalOffers = $('td[data-column="9"] a.offer-list-link')
    .map((_, y) => {
        const name = $(y).find('strong').text().trim();
        const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();

const amazonMusicPrimeOffers = $('td[data-column="10"] a.offer-list-link')
    .map((_, y) => {
        const name = $(y).find('strong').text().trim();
        const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();



const musicOffers = [
  { name: 'Deezer', items: deezerOffers },
  { name: 'Amazon Music Unlimited', items: amazonMusicUnlimitedOffers },
  { name: 'Apple Music', items: appleMusicOffers },

  { name: 'Spotify', items: spotifyOffers },
  { name: 'Qobuz', items: qobuzOffers },
  { name: 'Soundcloud Go', items: soundcloudGoOffers },

  { name: 'Napster', items: napsterOffers },
  { name: 'YouTube Music', items: youtubeMusicOffers },
  { name: 'TIDAL', items: tidalOffers },

  { name: 'Amazon Music Prime', items: amazonMusicPrimeOffers },
];

export {musicOffers}