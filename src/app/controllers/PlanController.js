import Plan from "./../models/Plan";
import * as Yup from "yup";

class PlanController {
    async index(req, res) {
        const { page = 1 } = req.query;

        const plans = await Plan.findAll({
            limit: 20,
            offset: (page - 1) * 20
        });

        return res.json(plans);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number()
                .integer()
                .required(),
            price: Yup.number()
                .required()
                .positive()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Validations fails." });
        }

        const { id, title, duration, price } = await Plan.create(req.body);

        return res.status(200).json({ id, title, duration, price });
    }

    async uptade(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number()
                .integer()
                .required(),
            price: Yup.number()
                .required()
                .positive()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Validations fails." });
        }

        const plan = await Plan.findByPk(req.params.id);

        if (!plan) {
            return res.status(400).json({
                error: "Plan couldn't be found."
            });
        }

        const { title, duration, price } = await plan.update(req.body);

        return res.status(200).json({ title, duration, price });
    }

    async destroy(req, res) {
        const plan = await Plan.findByPk(req.params.id);

        await plan.destroy();

        return res.status(200).json({
            message: "Plan was deleted with successful"
        });
    }

    async show() {}
}

export default new PlanController();
