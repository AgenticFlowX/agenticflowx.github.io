// Progressive enhancement for the site tour. No agent calls or file mutations.
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
function closeMenu() {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    closeMenu();
    menuButton.focus();
  }
});
matchMedia("(min-width: 951px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

for (const list of document.querySelectorAll('[role="tablist"]')) {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = (selected, focus = false) => {
    for (const tab of tabs) {
      const active = tab === selected;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
    }
    if (focus) selected.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        select(tabs[next], true);
      }
    });
  });
}

const example = document.querySelector("[data-example]");
if (example) {
  const copy = example.querySelector("[data-spec-document]").cloneNode(true);
  copy.removeAttribute("data-spec-document");
  example.querySelector("[data-viewer-document]").append(copy);
  const requirements = [...copy.querySelectorAll("h4")].find((heading) => heading.textContent.trim() === "Requirements");
  if (requirements) {
    const controls = document.createElement("div");
    controls.className = "afx-inline-actions";
    controls.innerHTML = '<span>Requirements</span><button type="button" data-demo-command="/afx-spec refine project-search Requirements">Refine</button><button type="button" data-demo-command="/afx-spec review project-search Requirements">Review</button>';
    requirements.after(controls);
  }

  const feedback = example.querySelector(".demo-feedback");
  example.querySelectorAll("[data-demo-command]").forEach((button) => {
    button.addEventListener("click", () => {
      const label = button.textContent.trim();
      feedback.textContent = `In the extension, ${label} ${["Validate", "Review"].includes(label) ? "sends" : "prepares"} this command in chat: ${button.dataset.demoCommand}. This website demo does not run it.`;
    });
  });
  example.querySelector("[data-demo-task]").addEventListener("change", (event) => {
    feedback.textContent = `Illustrative tasks.md update: - [${event.target.checked ? "x" : " "}] 1.1 Implement name filtering [FR-1]. No files are changed in this website demo.`;
  });
}

const dialog = document.querySelector(".image-dialog");
let screenshotTrigger;
document.querySelectorAll("[data-enlarge]").forEach((button) => {
  button.addEventListener("click", () => {
    const img = button.querySelector("img");
    screenshotTrigger = button;
    dialog.querySelector("img").src = img.src;
    dialog.querySelector("img").alt = img.alt;
    dialog.querySelector("p").textContent = img.alt;
    dialog.showModal();
    document.body.style.overflow = "hidden";
  });
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => {
  document.body.style.overflow = "";
  screenshotTrigger?.focus();
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.setAttribute("aria-live", "polite");
  button.addEventListener("click", async () => {
    const text = button.parentElement.querySelector("code").textContent;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied";
    } catch {
      button.textContent = "Select text";
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(button.parentElement.querySelector("code"));
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
});

// Keep the reading-page contents useful as the reader moves through a long guide.
const contentsLinks = [...document.querySelectorAll('.guide-nav nav a[href^="#"]')];
if (contentsLinks.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries.find((item) => item.isIntersecting);
      if (!entry) return;
      for (const link of contentsLinks) {
        if (link.hash === "#" + entry.target.id) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    },
    { rootMargin: "-15% 0px -65% 0px" },
  );
  for (const link of contentsLinks) {
    const section = document.getElementById(link.hash.slice(1));
    if (section) observer.observe(section);
  }
}

// A direct link can point inside a collapsed provider recipe.
function revealLinkedDetails() {
  const target = document.getElementById(location.hash.slice(1));
  const details = target?.closest("details");
  if (details && !details.open) {
    details.open = true;
    target.scrollIntoView({ block: "start" });
  }
}
revealLinkedDetails();
window.addEventListener("hashchange", revealLinkedDetails);

// Each embedded document has its own independent, non-persistent Previewer demo.
for (const viewer of document.querySelectorAll('[data-doc-viewer]')) {
  const status = viewer.querySelector('.afx-demo-status');
  viewer.addEventListener('click', (event) => {
    const action = event.target.closest('[data-viewer-command]');
    if (!action) return;
    const verb = action.dataset.viewerMode === 'send' ? 'sends' : 'prepares';
    status.textContent = `In the extension, ${action.textContent.trim()} ${verb} this command in chat: ${action.dataset.viewerCommand}. This illustration does not run an agent or change files.`;
  });
  viewer.addEventListener('change', (event) => {
    if (!event.target.matches('[data-viewer-checkbox]')) return;
    status.textContent = `Illustration: the task checkbox is ${event.target.checked ? 'checked' : 'unchecked'}. In the extension, supported task or session checkbox changes update the underlying Markdown. This page does not change files.`;
  });
}

// Click-to-play YouTube: nothing loads from YouTube until the visitor asks.
// Chapter buttons ([data-youtube-seek]) start the player at a timestamp, or
// seek the running player through the IFrame API without reloading it.
const startYoutube = (button, start = 0) => {
  const id = button.dataset.youtube;
  const frame = document.createElement("iframe");
  const origin = encodeURIComponent(location.origin);
  frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&enablejsapi=1&start=${start}&origin=${origin}`;
  frame.title = button.getAttribute("aria-label").replace(/^Play the /, "");
  frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  frame.allowFullscreen = true;
  const player = document.createElement("div");
  player.className = "x-yt is-playing";
  player.id = button.id;
  player.append(frame);
  frame.addEventListener("load", () => {
    frame.contentWindow.postMessage(JSON.stringify({ event: "listening" }), "*");
    setTimeout(() => (player.dataset.ready = "true"), 800);
  });
  button.replaceWith(player);
  return player;
};
for (const button of document.querySelectorAll("button[data-youtube]")) {
  button.addEventListener("click", () => startYoutube(button));
}
for (const chapter of document.querySelectorAll("[data-youtube-seek]")) {
  chapter.addEventListener("click", () => {
    const seconds = Number(chapter.dataset.youtubeSeek);
    const target = document.getElementById(chapter.dataset.youtubeTarget);
    if (!target) return;
    if (target.matches("button[data-youtube]")) {
      startYoutube(target, seconds);
    } else if (!target.dataset.ready) {
      const frame = target.querySelector("iframe");
      frame.src = frame.src.replace(/start=\d+/, `start=${seconds}`);
    } else {
      const frame = target.querySelector("iframe");
      const send = (func, args = []) =>
        frame.contentWindow.postMessage(JSON.stringify({ event: "command", func, args }), "*");
      send("seekTo", [seconds, true]);
      send("playVideo");
    }
    for (const item of document.querySelectorAll(`[data-youtube-target="${chapter.dataset.youtubeTarget}"]`))
      item.removeAttribute("aria-current");
    chapter.setAttribute("aria-current", "true");
    document.getElementById(chapter.dataset.youtubeTarget)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
}
