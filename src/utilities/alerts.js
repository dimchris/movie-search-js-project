const popUp = document.querySelector("cd-pop-up");
const confirm = document.querySelector("cd-confirm");
const input = document.querySelector("cd-input");
export default {
  alert: (title, msg) => {
    popUp.setAttribute("title", title);
    popUp.setAttribute("message", msg);
    popUp.setAttribute("type", "notification");
    popUp.setAttribute("hide", "false");
  },
  error: (title, msg) => {
    popUp.setAttribute("title", title);
    popUp.setAttribute("message", msg);
    popUp.setAttribute("type", "error");
    popUp.setAttribute("hide", "false");
  },
  warning: (title, msg) => {
    popUp.setAttribute("title", title);
    popUp.setAttribute("message", msg);
    popUp.setAttribute("type", "warning");
    popUp.setAttribute("hide", "false");
  },
  confirm: (title, msg, onConfirmHandler, onCancelHandler) => {
    confirm.setAttribute("title", title);
    confirm.setAttribute("message", msg);
    confirm.onConfirmHandler = onConfirmHandler;
    confirm.onCancelHandler = onCancelHandler;
    confirm.setAttribute("hide", "false");
  },
  input: (title, msg, onConfirmHandler, onCancelHandler) => {
    input.setAttribute("title", title);
    input.setAttribute("message", msg);
    input.onConfirmHandler = onConfirmHandler;
    input.onCancelHandler = onCancelHandler;
    input.setAttribute("hide", "false");
  },
  select: (title, msg, onConfirmHandler, onCancelHandler, tags, selected) => {
    input.setAttribute("title", title);
    input.setAttribute("message", msg);
    input.onConfirmHandler = onConfirmHandler;
    input.onCancelHandler = onCancelHandler;
    input.setAttribute("hide", "false");
    input.setAttribute("input-type", "drop-down-multi");
    input.tags = tags;
    input.selectedTags = selected;
  },
};
