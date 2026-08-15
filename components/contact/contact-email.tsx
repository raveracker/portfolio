/**
 * The email Allan receives when someone submits the contact form. Plain
 * inline styles rather than Tailwind - mail clients strip stylesheets, and
 * half of them strip anything they do not recognise in a style attribute too.
 */
export type ContactEmailProps = {
  name: string;
  email: string;
  message: string;
};

const wrapper: React.CSSProperties = {
  margin: 0,
  padding: "24px",
  backgroundColor: "#f4f5f7",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  color: "#16161d",
};

const card: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "32px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #e3e4e8",
};

const label: React.CSSProperties = {
  margin: "0 0 4px",
  fontSize: "11px",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "#6b6b78",
};

const value: React.CSSProperties = {
  margin: "0 0 20px",
  fontSize: "15px",
  lineHeight: 1.5,
};

export function ContactEmail({ name, email, message }: ContactEmailProps) {
  return (
    <div style={wrapper}>
      <div style={card}>
        <p style={{ ...label, color: "#2f7da3" }}>New portfolio message</p>
        <h1 style={{ margin: "0 0 28px", fontSize: "22px", fontWeight: 600 }}>
          {name} got in touch
        </h1>

        <p style={label}>From</p>
        <p style={value}>
          {name} &lt;
          <a href={`mailto:${email}`} style={{ color: "#2f7da3" }}>
            {email}
          </a>
          &gt;
        </p>

        <p style={label}>Message</p>
        {/* pre-wrap so the sender's own line breaks survive. */}
        <p style={{ ...value, whiteSpace: "pre-wrap", marginBottom: 0 }}>
          {message}
        </p>
      </div>

      <p
        style={{
          maxWidth: "560px",
          margin: "16px auto 0",
          fontSize: "12px",
          color: "#6b6b78",
        }}
      >
        Reply straight to this email and it goes back to {name}.
      </p>
    </div>
  );
}
