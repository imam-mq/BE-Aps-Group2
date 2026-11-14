import * as dashboardService from "../services/dashboard.service.js";
import { activityQuerySchema } from "../validators/dashboard.schema.js";
import { firstZodMessage } from "../utils/zodError.js";

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

export { getSummary, getActivity }