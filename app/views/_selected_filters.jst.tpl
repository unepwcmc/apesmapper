<!-- Species enable/disable input -->
<h1>Selected filters</h1>
<ul class='selected'>
  <% for(i in apes) { %>
    <li><%= apes[i].taxa %></li>
  <% } %>
</ul>
