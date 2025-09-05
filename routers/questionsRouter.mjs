import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionsRouter = Router();

questionsRouter.post("/", async (req, res) => {
    try {
        const newQuestion = {
            ...req.body,
        };

        if (!newQuestion.title || !newQuestion.description || !newQuestion.category) {
            return res.status(400).json({
                "message": "Invalid request data."
            })
        }

        await connectionPool.query(
            `
          INSERT INTO questions 
          (title, description, category)
          VALUES ($1, $2, $3)
          `,
            [
                newQuestion.title,
                newQuestion.description,
                newQuestion.category,
            ]
        );

        return res.status(201).json({
            message: "Question created successfully ✅",
        });
    } catch (err) {
        console.error("❌ Error in POST /posts:", err.message);
        return res.status(500).json({
            message: "Unable to create question.",
            error: err.message,
        });
    }
});

questionsRouter.post("/:questionId/answers", async (req, res) => {
    try {
        const questionIdFromClient = req.params.questionId;
        const newAnswer = {
            ...req.body,
        };

        if (!newAnswer.content) {
            return res.status(400).json({
                "message": "Invalid request data."
            })
        }
        if (newAnswer.content.length > 300) {
            return res.status(400).json({
                message: "Answer content must not exceed 300 characters."
            });
        }
        const checkQuestion = await connectionPool.query(
            `SELECT * FROM questions WHERE id = $1`,
            [questionIdFromClient]
        );

        if (!checkQuestion.rows[0]) {
            return res.status(404).json({
                message: `Question not found. (question id: ${questionIdFromClient})`,
            });
        }

        await connectionPool.query(
            `
          INSERT INTO answers 
          (question_id, content)
          VALUES ($1, $2)
          `,
            [
                questionIdFromClient,
                newAnswer.content,
            ]
        );

        return res.status(201).json({
            message: "Answer created successfully ✅",
        });
    } catch (err) {
        console.error("❌ Error in POST /questions/:questionId/answers:", err.message);
        return res.status(500).json({
            message: "Unable to create answers.",
            error: err.message,
        });
    }
});

questionsRouter.get("/search", async (req, res) => {
    let results;
    const title = req.query.title;
    const category = req.query.category;


    try {
        results = await connectionPool.query(
            `
        select * from questions 
        where 
            (title = $1 or $1 is null or $1 = '') 
            and 
            (category = $2 or $2 is null or $2 = '');
        `,
            [title, category]
        );
        if (!results.rows[0]) {
            return res.status(400).json({
                message: "Invalid search parameters.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch a question.",
            error: error.message, // ลบออกได้ถ้าไม่อยากโชว์ให้ client
        });
    }

    return res.status(200).json({
        data: results.rows,
    });
});

questionsRouter.get("/", async (req, res) => {
    let results;
    try {
        results = await connectionPool.query(`SELECT * FROM questions`);
    } catch (error) {
        console.error("Database error in GET /posts:", error);
        return res.status(500).json({
            message: "Unable to fetch questions.",
        });
    }

    return res.status(200).json({
        data: results.rows,
    });
});

questionsRouter.get("/:questionId", async (req, res) => {
    try {
        const questionIdFromClient = req.params.questionId;
        const results = await connectionPool.query(
            `
          SELECT * FROM questions WHERE id = $1
          `,
            [questionIdFromClient]
        );

        if (!results.rows[0]) {
            return res.status(404).json({
                message: `Question not found. (question id: ${questionIdFromClient})`,
            });
        }

        return res.status(200).json({
            data: results.rows[0],
        });
    } catch (error) {
        console.error("❌ Error in GET /questions/:questionId", error.message);
        return res.status(500).json({
            message: "Unable to fetch questions.",
        });
    }
});

questionsRouter.get("/:questionId/answers", async (req, res) => {
    try {
        const questionIdFromClient = req.params.questionId;
        const results = await connectionPool.query(
            `
          SELECT id, content FROM answers WHERE question_id = $1
          `,
            [questionIdFromClient]
        );

        if (!results.rows[0]) {
            return res.status(404).json({
                message: `Question not found. (question id: ${questionIdFromClient})`,
            });
        }

        return res.status(200).json({
            data: results.rows[0],
        });
    } catch (error) {
        console.error("❌ Error in GET /questions/:questionId/answers", error.message);
        return res.status(500).json({
            message: "Unable to fetch answers.",
        });
    }
});

questionsRouter.put("/:questionId", async (req, res) => {
    try {
        const questionIdFromClient = req.params.questionId;
        const updatedQuestion = {
            ...req.body,
        };

        if (!updatedQuestion.title || !updatedQuestion.description || !updatedQuestion.category) {
            return res.status(400).json({
                message: "Invalid request data.",
            });
        }

        const checkExistQuestion = await connectionPool.query(
            `SELECT * FROM questions WHERE id = $1`,
            [questionIdFromClient]
        );
        if (!checkExistQuestion.rows[0]) {
            return res.status(404).json({
                message: `Question not found. (question id: ${questionIdFromClient})`,
            });
        }

        await connectionPool.query(
            `
          UPDATE questions
          SET title = $2,
              description = $3,
              category = $4
          WHERE id = $1
        `,
            [
                questionIdFromClient,
                updatedQuestion.title,
                updatedQuestion.description,
                updatedQuestion.category,
            ]
        );

        return res.status(200).json({
            message: "Question updated successfully ✅",
        });
    } catch (err) {
        console.error("❌ Error in PUT /questions/:questionId:", err.message);
        return res.status(500).json({
            message: "Unable to fetch questions.",
            error: err.message, // 🔒 สามารถลบออกถ้าไม่อยากให้ client เห็นรายละเอียด
        });
    }
});

questionsRouter.delete("/:questionId", async (req, res) => {
    try {
        const questionIdFromClient = req.params.questionId;

        const checkExistQuestion = await connectionPool.query(
            `SELECT * FROM questions WHERE id = $1`,
            [questionIdFromClient]
        );
        if (!checkExistQuestion.rows[0]) {
            return res.status(404).json({
                message: `Question not found. (question id: ${questionIdFromClient})`,
            });
        }

        await connectionPool.query(`DELETE FROM questions WHERE id = $1`, [
            questionIdFromClient,
        ]);

        return res.status(200).json({
            message: "Question post has been deleted successfully. ✅",
        });
    } catch (err) {
        console.error("❌ Error in DELETE /questions/:questionId:", err.message);

        return res.status(500).json({
            message: "Unable to delete question.",
            error: err.message,
        });
    }
});

questionsRouter.delete("/:questionId/answers", async (req, res) => {
    try {
        const questionIdFromClient = req.params.questionId;

        const checkExistQuestion = await connectionPool.query(
            `SELECT * FROM questions WHERE id = $1`,
            [questionIdFromClient]
        );
        if (!checkExistQuestion.rows[0]) {
            return res.status(404).json({
                message: `Question not found. (question id: ${questionIdFromClient})`,
            });
        }

        await connectionPool.query(`DELETE FROM answers WHERE question_id = $1`, [
            questionIdFromClient,
        ]);

        return res.status(200).json({
            message: "All answers for the question have been deleted successfully. ✅",
        });
    } catch (err) {
        console.error("❌ Error in DELETE /questions/:questionId/answers:", err.message);

        return res.status(500).json({
            message: "Unable to delete answers.",
            error: err.message,
        });
    }
});


export default questionsRouter;