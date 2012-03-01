<% if(show_next) { %>
<a href="#" class="show">show</a>
<% } %>
<input id="<%= the_type %>_<%= id %>" class="check" type="checkbox" value="<%= id %>" <% if(selected) { %> checked="checked" <% } %>>
<label for="<%= the_type %>_<%= id %>">- <%= name %></label>
