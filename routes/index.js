const url = require('url');
const express = require('express');
const needle = require('needle');
const apiCache = require('apicache');

const router = express.Router();

// Env
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

// init cache
let cache = apiCache.middleware;

router.get('/', cache('2 minutes'), async (req, res, next) => {
  try {
    // forwarding query params
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...url.parse(req.url, true).query,
    });

    const apiResponse = await needle('get', `${API_BASE_URL}?${params}`);

    const data = apiResponse.body;

    // Log the request
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Request: ${API_BASE_URL}?${params}`);
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
