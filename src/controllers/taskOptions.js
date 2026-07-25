export const getTaskOptions = (req, res, next) => {
    return res.json({
        success: true,
        data: {
            status: [
                {
                    value: "TODO",
                    label: "Todo"
                },
                {
                    value: "IN_PROGRESS",
                    label: "In Progress"
                },
                {
                    value: "IN_REVIEW",
                    label: "In Review"
                },
                {
                    value: "DONE",
                    label: "Done"
                },
                {
                    value: "CANCELLED",
                    label: "Cancelled"
                }
            ],
            priority: [
                {
                    value: "LOW",
                    label: "Low"
                },
                {
                    value: "MEDIUM",
                    label: "Medium"
                },
                {
                    value: "HIGH",
                    label: "High"
                },
                {
                    value: "URGENT",
                    label: "Urgent"
                },
            ]
        }
    })
}