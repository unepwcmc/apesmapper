<!-- Species enable/disable input -->
<label for="<%= the_type %>_<%= id %>" class='select_species'>
  <div><%= name %></div>
  <input name="species" type="checkbox" <% if(selected){%> checked='true' <%}%> value="<%= id %>" id="<%= the_type %>_<%= id %>">
</label>
