import transporter from "../config/nodeMailer.js";

function sendBookingConfirmation(email, movie) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `🎟️ Your Ticket for ${movie.title} is Confirmed!`,
        html: `
            <h2>Booking Confirmation</h2>
            <p><strong>Movie:</strong> ${movie.title}</p>
            <p><strong>Genre:</strong> ${movie.genre}</p>
            <p><strong>Duration:</strong> ${movie.duration}</p>
            <p><strong>Languages:</strong> ${movie.languages}</p>
            <p>Enjoy the show! 🍿</p>
        `
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Error sending email:", err);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};

export default sendBookingConfirmation;