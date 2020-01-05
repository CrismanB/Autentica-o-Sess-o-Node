import Checkin from "./../models/Checkin";
import Student from "./../models/Student";
import { startOfWeek, endOfWeek } from "date-fns";
import { Op } from "sequelize";

class CheckinController {
    async index(req, res) {
        const student_id = req.params.id;

        const allcheckins = await Checkin.findAll({
            where: {
                student_id
            },
            include: [
                {
                    model: Student,
                    as: "student",
                    attributes: ["id", "name", "email"]
                }
            ],
            order: [["created_at", "DESC"]]
        });

        return res.status(200).json(allcheckins);
    }

    async store(req, res) {
        const student_id = req.params.id;

        //Verify if student can do check in
        const checkins = await Checkin.findAll({
            where: {
                student_id,
                created_at: {
                    [Op.between]: [
                        startOfWeek(new Date()),
                        endOfWeek(new Date())
                    ]
                }
            }
        });

        if (checkins.length === 5) {
            return res.status(401).json({
                error:
                    "You can't do check in because you made already 5 in this week."
            });
        }

        const checkin = await Checkin.create({ student_id });

        return res.status(200).json(checkin);
    }
}

export default new CheckinController();
