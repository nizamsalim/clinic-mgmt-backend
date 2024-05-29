"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function internalServerError(res, err) {
    console.log(err);
    return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Internal Server Error",
    });
}
exports.default = internalServerError;
