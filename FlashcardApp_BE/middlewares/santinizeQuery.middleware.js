const XSS_REGEX = /[<>$'";]/;

const sanitizeInput = (value) => {
    return String(value).trim().replace(/[$]/g, ""); // Loại bỏ ký tự "$"
};

const escapeHTML = (str) =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");

module.exports = (parameter = {}) => {
    return (req, res, next) => {
        const { required = [], optional = [], needEscapeHtml = false, option = "param" } = parameter;

        // Xử lý keyObject dựa vào option
        let keyObject;
        switch (option) {
            case "param":
                keyObject = req.params;
                break;
            case "query":
                keyObject = req.query;
                break;
            case "body":
                keyObject = req.body;
                break;
            default:
                return res.status(400).json({ message: "Invalid option parameter" });
        }

        // Kiểm tra các tham số bắt buộc
        for (const key of required) {
            const value = keyObject[key];

            if (!value || (typeof value === "string" && value.trim() === "")) {
                return res.status(400).json({ message: `Missing or invalid required parameter: ${key}` });
            }

            if (XSS_REGEX.test(value)) {
                return res.status(400).json({ message: "Malicious query rejected" });
            }

            keyObject[key] = sanitizeInput(value); // Reject harmful characters
            if (needEscapeHtml) {
                keyObject[key] = escapeHTML(keyObject[key]);
            }
        }

        // Kiểm tra các tham số tùy chọn
        for (const key of optional) {
            const value = keyObject[key];

            if (value && typeof value === "string") {
                if (XSS_REGEX.test(value) || value.trim() === "") {
                    return res.status(400).json({ message: `Malicious query detected in optional parameter: ${key}` });
                }

                keyObject[key] = sanitizeInput(value);
                if (needEscapeHtml) {
                    keyObject[key] = escapeHTML(keyObject[key]);
                }
            }
        }

        next();
    };
};