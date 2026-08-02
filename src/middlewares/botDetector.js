import { isbot } from "isbot";

export function botDetector(req, res, next) {
    const userAgent = req.get("User-Agent") || "Unknown";

    if (isbot(userAgent)) {
        console.warn("Bot detected:", {
            ip: req.ip,
            userAgent,
            path: req.originalUrl,
            method: req.method
        });

        return res.status(403).json({   
            success: false,
            error: "Request is blocked"
        });
    }

    next();
}