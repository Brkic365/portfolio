
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Hr,
} from "@react-email/components";
import * as React from "react";

interface ContactFormEmailProps {
    name: string;
    fromEmail: string;
    message: string;
    subject: string;
}

export const ContactFormEmail = ({
    name,
    fromEmail,
    message,
    subject,
}: ContactFormEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>{`New message from ${name}: ${subject}`}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>New Contact Message 📬</Heading>
                    <Text style={text}>
                        You received a new message from your portfolio contact form.
                    </Text>

                    <Section style={section}>
                        <Text style={label}>From:</Text>
                        <Text style={subjectText}>
                            {name} &lt;
                            <Link href={`mailto:${fromEmail}`} style={link}>
                                {fromEmail}
                            </Link>
                            &gt;
                        </Text>

                        <Hr style={hr} />

                        <Text style={label}>Subject:</Text>
                        <Text style={subjectText}>{subject}</Text>

                        <Hr style={hr} />

                        <Text style={label}>Message:</Text>
                        <Text style={messageText}>{message}</Text>
                    </Section>

                    <Text style={footer}>
                        Reply directly to this email to respond to {name}.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default ContactFormEmail;

// Styles
const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    maxWidth: "600px",
};

const h1 = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
};

const text = {
    color: "#333",
    fontSize: "16px",
    lineHeight: "26px",
    textAlign: "center" as const,
};

const section = {
    padding: "24px",
    margin: "0 20px",
    border: "1px solid #e6ebf1",
    borderRadius: "4px",
    backgroundColor: "#fafafa",
};

const label = {
    color: "#666",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    marginBottom: "8px",
};

const subjectText = {
    color: "#333",
    fontSize: "18px",
    fontWeight: "500",
    margin: "0 0 16px",
};

const messageText = {
    color: "#333",
    fontSize: "16px",
    lineHeight: "24px",
    whiteSpace: "pre-wrap" as const,
};

const hr = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
};

const link = {
    color: "#2563eb",
    textDecoration: "underline",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "16px",
    textAlign: "center" as const,
    marginTop: "32px",
};
