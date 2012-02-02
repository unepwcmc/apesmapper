<!-- Countries enable/disable input -->
<input name="countries" type="checkbox" <% if(selected) { %> checked="checked"<% } %> value="<%= id %>" id="country_select_<%= iso %>">
<label for="country_select_<%= iso %>"><%= name %><br/>
