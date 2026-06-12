// app/dashboard/DashboardClient.js
"use client";
import { signIn, signOut } from "next-auth/react";

export default function DashboardClient({ user }) {
  const steps = [
    {
      num: 1,
      title: "Discord Connected",
      desc: "Your Discord account is linked",
      done: !!user?.discordId,
      doneLabel: `@${user?.discordUsername}`,
      color: "#5865F2",
      action: null,
      actionLabel: null,
    },
    {
      num: 2,
      title: "Connect Google",
      desc: "Links your Gmail and Google Calendar",
      done: !!user?.googleRefreshToken,
      doneLabel: user?.googleEmail,
      color: "#4285F4",
      action: () => signIn("google", { callbackUrl: "/dashboard" }),
      actionLabel: !!user?.googleRefreshToken ? "Reconnect Google" : "Connect Google",
      // actionLabel: "Connect Google",
    },
    {
      num: 3,
      title: "Add Bot to Your Server",
      desc: "Bot will create a #ai-assistant channel automatically",
      done: !!user?.guildId,
      doneLabel: "Bot is in your server ✓",
      color: "#57F287",
      action: () => window.open(process.env.NEXT_PUBLIC_BOT_INVITE_URL, "_blank"),
      actionLabel: "Add Bot to Server",
    },
  ];

  const allDone = steps.every((s) => s.done);

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#0a0f1e",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#fff",
    },
    nav: {
      borderBottom: "1px solid #1f2d45",
      padding: "16px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    navLeft: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontWeight: 700,
      fontSize: "1.1rem",
    },
    navRight: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    avatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
    },
    username: {
      color: "#8ba8c8",
      fontSize: "0.9rem",
    },
    signoutBtn: {
      background: "transparent",
      border: "1px solid #1f2d45",
      color: "#6b7c99",
      borderRadius: "8px",
      padding: "6px 14px",
      cursor: "pointer",
      fontSize: "0.82rem",
    },
    main: {
      maxWidth: "620px",
      margin: "0 auto",
      padding: "48px 20px",
    },
    heading: {
      fontSize: "2rem",
      fontWeight: 800,
      marginBottom: "8px",
    },
    subheading: {
      color: "#6b7c99",
      fontSize: "0.95rem",
      marginBottom: "40px",
    },
    stepCard: (done) => ({
      background: done ? "rgba(52,168,83,0.05)" : "#111827",
      border: `1px solid ${done ? "rgba(52,168,83,0.25)" : "#1f2d45"}`,
      borderRadius: "14px",
      padding: "20px 22px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "12px",
    }),
    stepNum: (done) => ({
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: done ? "#34A853" : "#1a2235",
      border: done ? "none" : "1px solid #1f2d45",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: "0.9rem",
      color: done ? "#fff" : "#6b7c99",
      flexShrink: 0,
    }),
    stepText: {
      flex: 1,
    },
    stepTitle: {
      fontWeight: 700,
      fontSize: "0.95rem",
      marginBottom: "3px",
    },
    stepDesc: (done, color) => ({
      fontSize: "0.82rem",
      color: done ? color : "#6b7c99",
    }),
    actionBtn: (color) => ({
      background: color,
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "9px 18px",
      fontWeight: 700,
      fontSize: "0.82rem",
      cursor: "pointer",
      whiteSpace: "nowrap",
      flexShrink: 0,
    }),
    examplesBox: {
      background: "#111827",
      border: "1px solid #1f2d45",
      borderRadius: "14px",
      padding: "24px",
      marginTop: "32px",
    },
    examplesTitle: {
      fontWeight: 700,
      fontSize: "1rem",
      marginBottom: "16px",
    },
    exampleRow: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      background: "#0a0f1e",
      borderRadius: "8px",
      padding: "10px 14px",
      marginBottom: "8px",
      fontSize: "0.85rem",
      color: "#c8dff5",
      fontFamily: "monospace",
    },
    successBanner: {
      background: "rgba(52,168,83,0.1)",
      border: "1px solid rgba(52,168,83,0.3)",
      borderRadius: "14px",
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "32px",
    },
  };

  return (
    <div style={styles.page}>
      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          🤖 <span>Discord Assistant</span>
        </div>
        <div style={styles.navRight}>
          {user?.image && (
            <img src={user.image} alt="avatar" style={styles.avatar} />
          )}
          <span style={styles.username}>
            {user?.discordUsername || user?.name}
          </span>
          <button
            style={styles.signoutBtn}
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign out
          </button>
        </div>
      </nav>

      <div style={styles.main}>
        {/* Header */}
        <h1 style={styles.heading}>
          {allDone ? "🎉 You're all set!" : "Setup your bot"}
        </h1>
        <p style={styles.subheading}>
          {allDone
            ? "Go to your Discord server and type in #ai-assistant"
            : "Complete all 3 steps to activate your personal AI assistant"}
        </p>

        {/* Success banner */}
        {allDone && (
          <div style={styles.successBanner}>
            <span style={{ fontSize: "2rem" }}>✅</span>
            <div>
              <div style={{ fontWeight: 700, color: "#34A853", marginBottom: "4px" }}>
                Everything is connected!
              </div>
              <div style={{ color: "#6b7c99", fontSize: "0.85rem" }}>
                Your bot is using YOUR Gmail and YOUR Google Calendar.
                No one else can see your data.
              </div>
            </div>
          </div>
        )}

        {/* Steps */}
        {steps.map((step) => (
          <div key={step.num} style={styles.stepCard(step.done)}>
            <div style={styles.stepNum(step.done)}>
              {step.done ? "✓" : step.num}
            </div>
            <div style={styles.stepText}>
              <div style={styles.stepTitle}>{step.title}</div>
              <div style={styles.stepDesc(step.done, step.color)}>
                {step.done ? step.doneLabel : step.desc}
              </div>
            </div>
            {step.action && (  // done check hatao
              <button
                style={styles.actionBtn(step.color)}
                onClick={step.action}
              >
                {step.actionLabel}
              </button>
            )}
          </div>
        ))}

        {/* Example commands */}
        <div style={styles.examplesBox}>
          <div style={styles.examplesTitle}>💬 What to type in Discord</div>
          {[
            { icon: "📧", text: 'Send email to john@gmail.com — subject: Update — body: Hey, just checking in!' },
            { icon: "📅", text: "Meeting tomorrow at 3 PM with the design team" },
            { icon: "🔔", text: "Reminder on Friday at 10am — submit the weekly report" },
            { icon: "💬", text: "What is the capital of France?" },
            { icon: "💻", text: "Write a Python function to reverse a string" },
          ].map((item, i) => (
            <div key={i} style={styles.exampleRow}>
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}