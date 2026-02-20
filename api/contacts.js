import fs from "fs";
import path from "path";

export default function handler(req, res) {

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    const { fullname, email, phone, subject, message } = req.body;
  
    // Validate empty
    if (!fullname || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: "All fields required" });
    }
  
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }


  const newMessage = {
    fullname,
    email,
    phone,
    subject,
    message,
    date: new Date()
  };

  const filePath = path.join(process.cwd(), "data", "messages.json");

  let messages = [];

  if (fs.existsSync(filePath)) {
    messages = JSON.parse(fs.readFileSync(filePath));
  }

  messages.push(newMessage);

  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
  
    // For now just return success (no fs on vercel)
    return res.status(200).json({
      message: "Message received successfully!"
    });
  }