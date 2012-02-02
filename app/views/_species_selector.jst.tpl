<!-- Species enable/disable input -->
<label for="<%= the_type %>_<%= id %>" class='select_option'>
  <div><%= name %></div>
  <input name="<%= the_type %>" type="checkbox" <% if(selected){%> checked='true' <%}%> value="<%= id %>" id="<%= the_type %>_<%= id %>">
</label>
