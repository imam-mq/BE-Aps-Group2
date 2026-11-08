const dashboardService  = require("../services/dashboard.service");
const { activityQuerySchema } = require("../validators/dashboard.schema");
const { firstZodMessage  } = require("../utils/zodError");


async function getSummary(req, res, next) {
    try {
        res.json(await dashboardService.getSummary());
    } catch (err) {
        next(err);
    }
}

async function getActivity(req, res, next) {
    try {
        const parsed = activityQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: firstZodMessage(parsed.error) });
        }
        res.json(await dashboardService.getActivity(parsed.data));
    } catch (err) {
        next(err);
    }
}

module.exports = { getSummary, getActivity }