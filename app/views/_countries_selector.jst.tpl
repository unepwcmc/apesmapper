<!-- Countries enable/disable input -->
<input name="countries" type="checkbox" '<% if(selected){%> checked='true' <%}%>' value="<%= iso %>" id="country_select_<%= iso %>">
<label for="country_select_<%= iso %>"><%= name %><br/>
