/** Routes for users of pg-intro-demo. */

const db = require("../db");
const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();


// this version doesn't work --- db.query returns a promise,
// so we need to await it in an async function

/** Get users: [user, user, user] */

// router.get("/all", function (req, res, next) {
//   const results = db.query(
//         `SELECT * FROM users`);

//   return res.json(results.rows);
// });


/** (Fixed) Get users: [user, user, user] */

router.get("/", async function (req, res, next) {
    try{
    const results = await db.query(
          `SELECT * FROM users`);

    return res.json({users: results.rows});
    } catch (e) {
        return next(e);
    }

});


// // this version has security holes --- you could inject SQL
// // because the input isn't sanitized!

// /** Search by user type. */

// router.get("/bad-search", async function (req, res, next) {
//   try {
//     const type = req.query.type;
    
//     const results = await db.query(
//       `SELECT id, name, type 
//        FROM users
//        WHERE type='${type}'`);

//     return res.json(results.rows);
//   }

//   catch (err) {
//     return next(err);
//   }
// });


// // fixed version that uses parameterized query

// // (Fixed) Search by user type. */

router.get("/search",
      async function (req, res, next) {
  try {
    const type = req.query.type; // or destructured const { type } = req.query;

    const results = await db.query(
      `SELECT id, name, type 
       FROM users
       WHERE type=$1`, [type]);

    return res.json(results.rows);
  }

  catch (err) {
    return next(err);
  }
});


router.get("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const results = await db.query(
            `SELECT * FROM users WHERE id = $1`, [id]);
      if(results.rows.length === 0) {
          throw new ExpressError(`Can't find user with id of ${id}`, 404);
      }  
      return res.send({user: results.rows[0]})
    }
  
    catch (err) {
      return next(err);
    }
  });
  

// /** Create new user, return user */

router.post("/", async function (req, res, next) {
  try {
    const { name, type } = req.body;

    const result = await db.query(
          `INSERT INTO users (name, type) 
           VALUES ($1, $2)
           RETURNING id, name, type`,
        [name, type]
    );

    return res.status(201).json({user: result.rows[0]});
  }

  catch (err) {
    return next(err);
  }
});


// /** Update user, returning user */

router.patch("/:id", async (req, res, next) => {
  try {
    const {id} = req.params;
    const { name, type } = req.body;

    const result = await db.query(
          `UPDATE users SET name=$1, type=$2
           WHERE id = $3
           RETURNING id, name, type`,
        [name, type, req.params.id]
    )
        if(result.rows.length === 0) {   
        throw new ExpressError(`Can't update user with id of ${id}`, 404);
    }  
    return res.send({ user: result.rows[0]});
  }

  catch (err) {
    return next(err);
  }
});


// /** Delete user, returning {message: "Deleted"} */

router.delete("/:id", async function (req, res, next) {
  try {
    const result = await db.query(
        "DELETE FROM users WHERE id = $1",
        [req.params.id]
    );

    return res.send({message: "Deleted"});
  }

  catch (err) {
    return next(err);
  }
});
// end


module.exports = router;
