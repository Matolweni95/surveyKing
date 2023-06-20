const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());

app.use(express.json());

// Create a PostgreSQL pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'surveydb',
    password: '',
    port: 5432, 
});


// Submitting survey
app.post('/survey', async (req, res) => {
    try {
      const client = await pool.connect();
  
        const {
        name,
        surname,
        age,
        contact_number,
        date,
        favorite_food,
        eatOut,
        watchMovies,
        watchTV,
        listenToRadio,
      } = req.body;
  
      const userQuery = `
        INSERT INTO public.user (user_id, name, surname, age, contact_number)
        VALUES (DEFAULT, $1, $2, $3, $4)
        RETURNING user_id
      `;
  
      const userValues = [
        name,
        surname,
        age,
        contact_number,
      ];
  
      const userResult = await client.query(userQuery, userValues);
      const userId = userResult.rows[0].user_id;
  
      const responseQuery = `
        INSERT INTO public.response (response_id, user_id, eat_out, watch_movies, watch_tv, listen_to_radio, date, favorite_food)
        VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7)
      `;
  
      const responseValues = [
        userId,
        eatOut,
        watchMovies,
        watchTV,
        listenToRadio,
        date,
        favorite_food,
      ];
  
      await client.query(responseQuery, responseValues);
      client.release();
  
      res.json({ message: 'Survey response submitted successfully!' });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred while submitting the survey response.' });
    }
});

// Retrieving survey statistics
app.get('/survey/statistics', async (req, res) => {
    try {
      const client = await pool.connect();
  
      // Calculate the total number of surveys completed
      const totalCountQuery = `SELECT COUNT(*) FROM response`;
      const totalCountResult = await client.query(totalCountQuery);
      const totalCount = totalCountResult.rows[0].count;
  
      // Calculate the average age of participants
      const averageAgeQuery = `SELECT AVG(age) FROM "user"`;
      const averageAgeResult = await client.query(averageAgeQuery);
      const averageAge = parseFloat(averageAgeResult.rows[0].avg).toFixed(1);
  
      // Retrieve the oldest person's information
      const oldestPersonQuery = `SELECT * FROM "user" ORDER BY age DESC LIMIT 1`;
      const oldestPersonResult = await client.query(oldestPersonQuery);
      const oldestPerson = oldestPersonResult.rows[0];
  
      // Retrieve the youngest person's information
      const youngestPersonQuery = `SELECT * FROM "user" ORDER BY age ASC LIMIT 1`;
      const youngestPersonResult = await client.query(youngestPersonQuery);
      const youngestPerson = youngestPersonResult.rows[0];
  
      // Calculate the percentage of people who like Pizza
      const pizzaLikeCountQuery = `SELECT COUNT(*) FROM response WHERE favorite_food @> ARRAY['pizza']`;
      const pizzaLikeCountResult = await client.query(pizzaLikeCountQuery);
      const pizzaLikeCount = parseInt(pizzaLikeCountResult.rows[0].count);
      const pizzaLikePercentage = ((pizzaLikeCount / totalCount) * 100).toFixed(0);

      // Calculate the percentage of people who like Pasta
      const pastaLikeCountQuery = `SELECT COUNT(*) FROM response WHERE favorite_food @> ARRAY['pasta']`;
      const pastaLikeCountResult = await client.query(pastaLikeCountQuery);
      const pastaLikeCount = parseInt(pastaLikeCountResult.rows[0].count);
      const pastaLikePercentage = ((pastaLikeCount / totalCount) * 100).toFixed(0);

      // Calculate the percentage of people who like Pap And Wors
      const papAndWorsLikeCountQuery = `SELECT COUNT(*) FROM response WHERE favorite_food @> ARRAY['papAndWors']`;
      const papAndWorsLikeCountResult = await client.query(papAndWorsLikeCountQuery);
      const papAndWorsLikeCount = parseInt(papAndWorsLikeCountResult.rows[0].count);
      const papAndworsLikePercentage = ((papAndWorsLikeCount / totalCount) * 100).toFixed(0);
  
      // Calculate the average rating for eating out
      const averageEatOutQuery = `SELECT AVG(eat_out) FROM response`;
      const averageEatOutResult = await client.query(averageEatOutQuery);
      const averageEatOutRating = parseFloat(averageEatOutResult.rows[0].avg).toFixed(1);

      // Calculate the average rating for watching movies
      const averageWatchMovieQuery = `SELECT AVG(watch_movies) FROM response`;
      const averageWatchMovieResult = await client.query(averageWatchMovieQuery);
      const averageWatchMovieRating = parseFloat(averageWatchMovieResult.rows[0].avg).toFixed(1);

      // Calculate the average rating for watching TV
      const averageWatchTVQuery = `SELECT AVG(watch_tv) FROM response`;
      const averageWatchTVResult = await client.query(averageWatchTVQuery);
      const averageWatchTVRating = parseFloat(averageWatchTVResult.rows[0].avg).toFixed(1);

      // Calculate the average rating for Listening to Radio
      const averageRadioQuery = `SELECT AVG(listen_to_radio) FROM response`;
      const averageRadioResult = await client.query(averageRadioQuery);
      const averageRadioRating = parseFloat(averageRadioResult.rows[0].avg).toFixed(1);
  
      client.release();
  
      res.json({
        totalCount,
        averageAge,
        oldestPerson,
        youngestPerson,
        pizzaLikePercentage,
        pastaLikePercentage,
        papAndworsLikePercentage,
        averageEatOutRating,
        averageWatchMovieRating,
        averageRadioRating,
        averageWatchTVRating
      });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred while retrieving survey statistics.' });
    }
});
  
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});