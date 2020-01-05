import { addMonths, parseISO, format } from "date-fns";
import { pt } from "date-fns/locale";
import * as Yup from "yup";
import Registration from "./../models/Registration";
import Student from "./../models/Student";
import Plan from "./../models/Plan";
import Mail from "./../../lib/Mail";
import { formatPriceBR } from "./../../lib/Currency";

class RegistrationController {
    async index(req, res) {
        const registrations = await Registration.findAll({
            attributes: [
                "id",
                "start_date",
                "end_date",
                "total_price",
                "active"
            ],

            include: [
                {
                    model: Student,
                    as: "student",
                    attributes: ["name"]
                },
                {
                    model: Plan,
                    as: "plan",
                    attributes: ["title"]
                }
            ]
        });

        return res.status(200).json(registrations);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            student_id: Yup.number()
                .integer()
                .required(),
            plan_id: Yup.number()
                .integer()
                .required(),
            start_date: Yup.date().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Validations fails." });
        }

        const { student_id, plan_id, start_date } = req.body;

        //check if student_id is valid.
        const student = await Student.findByPk(student_id);

        if (!student) {
            return res.status(400).json({ Error: "student_id not found." });
        }

        //check is plan_id is valid
        const plan = await Plan.findByPk(plan_id);

        if (!plan) {
            return res.status(400).json({ Error: "plan_id not found." });
        }

        //Create registration
        const total_price = parseInt(plan.duration) * parseFloat(plan.price);

        const end_date = addMonths(parseISO(start_date), plan.duration);

        const registration = await Registration.create({
            student_id,
            plan_id,
            total_price,
            start_date,
            end_date
        });

        await Mail.sendMail({
            to: `${student.name}  <${student.email}>`,
            subject: "GymPoint - Detalhes da sua inscrição",
            template: "welcome",
            context: {
                name: student.name,
                plan: plan.title,
                date: format(end_date, "'dia' dd 'de' MMMM', ás' H:mm'h'", {
                    locale: pt
                }),
                total: formatPriceBR(total_price)
            }
        });

        return res.status(201).json(registration);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            student_id: Yup.number()
                .integer()
                .required(),
            plan_id: Yup.number()
                .integer()
                .required(),
            start_date: Yup.date().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Validations fails." });
        }

        const { student_id, plan_id, start_date } = req.body;

        //check if student_id is valid.
        const student = await Student.findByPk(student_id);

        if (!student) {
            return res.status(400).json({ Error: "student_id not found." });
        }

        //check is plan_id is valid
        const plan = await Plan.findByPk(plan_id);

        if (!plan) {
            return res.status(400).json({ Error: "plan_id not found." });
        }

        const registration = await Registration.findByPk(req.params.id);

        //check if is a registration valid before update it.
        if (!registration) {
            return res
                .status(400)
                .json({ Error: "Registration invalid to update." });
        }

        //Update registration
        const total_price = parseInt(plan.duration) * parseFloat(plan.price);

        const end_date = addMonths(parseISO(start_date), plan.duration);

        await registration.update({
            student_id,
            plan_id,
            total_price,
            start_date,
            end_date
        });

        return res.status(200).json(registration);
    }

    async destroy(req, res) {
        const registration = await Registration.findByPk(req.params.id);

        //check if registration is valid to be deleted.
        if (!registration) {
            return res
                .status(400)
                .json({ Error: "Registration not found to be deleted." });
        }

        await registration.destroy();

        return res
            .status(200)
            .json({ message: "Registration was deleted with successful" });
    }
}

export default new RegistrationController();
