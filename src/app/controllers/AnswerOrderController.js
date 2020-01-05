import HelpOrder from "./../models/HelpOrder";
import Student from "./../models/Student";
import Mail from "./../../lib/Mail";

class AnswerOrderController {
    async index(req, res) {
        const questions = await HelpOrder.findAll({
            where: {
                answer: null
            },
            include: [
                {
                    model: Student,
                    as: "student",
                    attributes: ["name"]
                }
            ]
        });

        return res.status(200).json(questions);
    }

    async store(req, res) {
        const help_order_id = req.params.id;
        const { answer } = req.body;

        const help_order = await HelpOrder.findByPk(help_order_id, {
            include: [
                {
                    model: Student,
                    as: "student",
                    attributes: ["id", "name", "email"]
                }
            ]
        });

        if (!help_order) {
            return res.status(401).json({ error: "Question not found." });
        }

        const answered = await help_order.update({
            answer,
            answer_at: new Date()
        });

        Mail.configureTemplates("helpOrders");

        await Mail.sendMail({
            to: `${answered.student.name}  <${answered.student.email}>`,
            subject: "GymPoint - Resposta de suas duvidas.",
            template: "answer",
            context: {
                name: answered.student.name,
                question: answered.question,
                answer: answered.answer
            }
        });

        return res.status(200).json(answered);
    }
}

export default new AnswerOrderController();
