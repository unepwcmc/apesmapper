<!-- Species enable/disable input -->
<h1>Selected species</h1>
<ul class='selected'>
  <% for(ape in apes) { %>
    <li><%= taxa %></li>
  <% } %>
</ul>
<!-- Countries enable/disable input -->
<h1>Selected countries</h1>
<ul class='selected'>
  <% for(country in countries) { %>
    <li><%= name %></li>
  <% } %>
</ul>