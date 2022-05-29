/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
app.views.TypeList = class TypeList extends app.View {
  static initClass() {
    this.tagName = "div";
    this.className = "_list _list-sub";

    this.events = {
      open: "onOpen",
      close: "onClose",
    };
  }

  constructor(doc) {
    super(undefined, { doc });
  }

  init() {
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);

    this.lists = {};
    this.render();
    this.activate();
  }

  activate() {
    if (super.activate(...arguments)) {
      for (let slug in this.lists) {
        const list = this.lists[slug];
        list.activate();
      }
    }
  }

  deactivate() {
    if (super.deactivate(...arguments)) {
      for (let slug in this.lists) {
        const list = this.lists[slug];
        list.deactivate();
      }
    }
  }

  render() {
    let html = "";
    for (let group of Array.from(this.doc.types.groups())) {
      html += this.tmpl("sidebarType", group);
    }
    return this.html(html);
  }

  onOpen(event) {
    $.stopEvent(event);
    const type = this.doc.types.findBy(
      "slug",
      event.target.getAttribute("data-slug")
    );

    if (type && !this.lists[type.slug]) {
      this.lists[type.slug] = new app.views.EntryList(type.entries());
      $.after(event.target, this.lists[type.slug].el);
    }
  }

  onClose(event) {
    $.stopEvent(event);
    const type = this.doc.types.findBy(
      "slug",
      event.target.getAttribute("data-slug")
    );

    if (type && this.lists[type.slug]) {
      this.lists[type.slug].detach();
      delete this.lists[type.slug];
    }
  }

  paginateTo(model) {
    if (model.type) {
      this.lists[model.getType().slug]?.paginateTo(model);
    }
  }
};
app.views.TypeList.initClass();
