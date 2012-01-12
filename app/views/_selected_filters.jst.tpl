<!-- Species enable/disable input -->
<h1>Selected species</h1>
<ul class='selected'>
  <% for(i in apes) { %>
    <li><%= apes[i].taxa %></li>
  <% } %>
</ul>
<!-- Countries enable/disable input -->
<h1>Selected countries</h1>
<ul class='selected'>
  <% for(i in countries) { %>
    <li><%= countries[i].name %></li>
  <% } %>
</ul>
<button id="edit_filter">Change filters</button>