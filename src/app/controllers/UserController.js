import User from "./../models/User";
import * as Yup from "yup";

class UserController {
    async index(req, res) {
        const users = User.findAll({
            where: {}
        });
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string()
                .required()
                .min(6)
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Validations fails." });
        }

        const userExist = await User.findOne({
            where: { email: req.body.email }
        });

        if (userExist) {
            return res.status(400).json({ error: "User already exists." });
        }
        const { id, name, email } = await User.create(req.body);

        return res.json({ id, name, email });
    }

    async update(req, res) {
        return res.json({ ok: true });
    }
}

export default new UserController();
