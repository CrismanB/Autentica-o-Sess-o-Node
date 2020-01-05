import Student from "./../models/Student";
import * as Yup from "yup";
import { Op } from "sequelize";

class StudentController {
    async show(req, res) {
        const student_id = req.params.id;

        try {
            const student = await Student.findByPk(student_id);
            return res.json(student);
        } catch (error) {
            return res.status(404).json({ error: "Student not found." });
        }
    }

    async index(req, res) {
        const user = req.query.name;

        const query = !user
            ? {}
            : {
                  where: {
                      name: { [Op.iLike]: `${user}%` }
                  }
              };

        const users = await Student.findAll(query);

        return res.json(users);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            age: Yup.number()
                .required()
                .positive()
                .integer(),
            height: Yup.number()
                .required()
                .positive(),

            weight: Yup.number()
                .required()
                .positive()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Validations fails." });
        }

        const studentExist = await Student.findOne({
            where: { email: req.body.email }
        });

        if (studentExist) {
            return res.status(400).json({ error: "e-mail already exists." });
        }

        const { id, name, email, age, height, weight } = await Student.create(
            req.body
        );

        return res.status(200).json({
            id,
            name,
            email,
            age,
            height,
            weight
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            age: Yup.number()
                .positive()
                .integer(),
            height: Yup.number().positive(),

            weight: Yup.number().positive()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "validations fails" });
        }

        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(400).json({ Error: "Student couldn`t be find." });
        }

        const { id, name, email, age, height, weight } = await student.update(
            req.body
        );

        return res.status(200).json({
            id,
            name,
            email,
            age,
            height,
            weight
        });
    }

    async destroy(req, res) {
        const student = await Student.findByPk(req.params.id);

        await student.destroy();

        return res.status(200).json({
            message: "Student was deleted with successful"
        });
    }
}

export default new StudentController();
