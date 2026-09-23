const helmet = require('helmet');
const cors = require('cors');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

module.exports = (app) => {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );
  
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()) 
    : ['*'];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '10kb' }));
  app.use(mongoSanitize());
  app.use(xss());
};
