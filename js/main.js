var Todo = Backbone.Model.extend({
  defaults: {
      checked:false
    }
});

var TodoListItems = Backbone.Collection.extend({
    model: Todo
});

var TodoView = Backbone.View.extend({
  tagName: "li",
  initialize: function() {
    this.model.on("change", this.updateTodoView, this);
    this.render();
  },
  updateTodoView: function(todoItem) {
    this.render();
  },
  events: {
    "click #checkbox": "onCheckboxClick",
    "click .delete": "onDeleteClick"
  },
  onDeleteClick: function() {
    this.model.destroy();
    this.$el.remove();
  },
  onCheckboxClick: function() {
    this.model.set("checked", !this.model.get("checked"));
    if (this.model.get("checked")) this.$el.addClass("checked");
    if (!this.model.get("checked")) this.$el.removeClass("checked");
  },
  render: function() {
    var checked = this.model.get("checked") ? "checked" : "";
    this.$el.html(
      '<input type="checkbox" ' +
        checked +
        ' id="checkbox">' +
        this.model.get("title") +
        '<button class="delete">Delete</button>'
    );
    return this;
  }
});

var todoListItems = new TodoListItems([
  new Todo({ title: "Eat fish" }),
  new Todo({ title: "Call mummy" }),
  new Todo({ title: "Buy iPhone 12" }),
  new Todo({ title: "Sleep 11 Hours" }),
  new Todo({ title: "Play Super Mario" }),
  new Todo({ title: "Code for fone" }),
]);

var TodoListView = Backbone.View.extend({
  tagName: "ul",
  initialize: function() {
    this.render();
    this.model.on("add", this.addNewItem, this);
  },
  addNewItem: function (newItem) {
    var newTodoView = new TodoView({ model: newItem });
    this.$el.append(newTodoView.$el);
  },
  events: {
    "click .add": "onAddClick",
    "keypress .todoTitle":"onKeyPress"
  },
  onKeyPress: function (e) {
    if (e.originalEvent.keyCode == 13) 
    {
      this.onAddClick()
    }
  },
  onAddClick: function () {
    var todoTitle = this.$(".todoTitle").val();
    if (!this.$(".todoTitle").val()) return;
      var newItem = new Todo({ title: todoTitle });
    this.model.add(newItem);
    this.$(".todoTitle").val("");
  },
  render: function() {
    this.$el.append(
      "<input autofocus class='todoTitle' placeholder='Enter something...' type='text'><button class='add'>Add Todo</button>"
    );
    var self = this;
    this.model.each(function(model) {
      var todoView = new TodoView({ model: model });
      self.$el.append(todoView.$el);
    });

    return this;
  }
});

var todoListView = new TodoListView({ model: todoListItems });
$(".todoList").append(todoListView.$el);
