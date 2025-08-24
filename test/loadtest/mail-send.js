import http from "k6/http";

export const options = {
    vus: 500,          // virtual users
    duration: "30s",   // test duration
};

export default function () {
    const url = "http://localhost:3000/mail/send";
    const payload = JSON.stringify({
        subject: "Performance test",
        html: "<p>Load test email</p>",
        sender: { email: "test@zeustra.com", name: "Tester" },
        recipients: [{ email: "mstwalass@gmail.com", name: "Recipient" }],
    });

    const params = {
        headers: {
            "Authorization": "Bearer 96c3dfae06e11a5df03ae5f44dc807946024385a78eba35d062547f2918c46e0",
            "Content-Type": "application/json",
        },
    };

    http.post(url, payload, params);
}
