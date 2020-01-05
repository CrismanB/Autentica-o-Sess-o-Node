import HelpOrder from "./../models/HelpOrder";
import * as Yup from "yup";

class HelpOrderController {
    async show(req, res) {
        const student_id = req.params.id;

        const myQuestions = await HelpOrder.findAll({
            where: {
                student_id
            },
            order: [["created_at", "DESC"]]
        });

        return res.status(200).json(myQuestions);
    }

    async index(req, res) {
        const Questions = await HelpOrder.findAll({});

        return res.status(200).json(Questions);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            question: Yup.string().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Validations fails." });
        }

        const student_id = parseInt(req.params.id);
        const { question } = req.body;

        await HelpOrder.create({
            student_id,
            question
        });

        return res.status(200).json({ student_id, question });
    }
}

export default new HelpOrderController();
