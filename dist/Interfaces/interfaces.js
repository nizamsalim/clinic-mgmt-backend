"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMIT = exports.ROLLBACK = exports.TRANSACTION = exports.USER_ROLE = void 0;
var USER_ROLE;
(function (USER_ROLE) {
    USER_ROLE["doctor"] = "DOCTOR";
    USER_ROLE["patient"] = "PATIENT";
    USER_ROLE["admin"] = "ADMIN";
})(USER_ROLE || (exports.USER_ROLE = USER_ROLE = {}));
exports.TRANSACTION = "START TRANSACTION";
exports.ROLLBACK = "ROLLBACK";
exports.COMMIT = "COMMIT";
