document.addEventListener("DOMContentLoaded", () => {

    document.title = MESSAGES.browserTitle || document.title;

    setText("appTitle", MESSAGES.index.appTitle);
    setText("studentName", MESSAGES.index.studentName);
    setText("landingIntro", MESSAGES.index.landingIntro);
    setText("writerLink", MESSAGES.index.writerLink);
    setText("readerLink", MESSAGES.index.readerLink);

    const by = MESSAGES.index.byLabel || "by";
    setText("heroTitle", `${MESSAGES.index.appTitle} ${by} ${MESSAGES.index.studentName}`);

})