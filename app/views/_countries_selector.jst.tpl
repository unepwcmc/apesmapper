<!-- Countries enable/disable input -->
<label for="country_select_<%= id %>" class="select_option">
  <div><%= name %></div>
  <input name="<%= the_type %>" type="checkbox" <% if(selected) { %> checked="checked"<% } %> value="<%= id %>" id="<%= the_type %>_<%= id %>">
</label>
