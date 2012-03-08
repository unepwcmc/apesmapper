<% if(show_next) { %>
  <a href="#" class="show">show</a>
  <input id="<%= the_type %>_<%= id %>" class="check" type="hidden" value="<%= id %>">
<% } else {%>
  <input id="<%= the_type %>_<%= id %>" class="check" type="checkbox" value="<%= id %>" <% if(selected) { %> checked="checked" <% } %>>
<% } %>
<label for="<%= the_type %>_<%= id %>"><%= taxa_common_name %><%= name %><% if(show_next) { %> <span class="select_all">select all</span><% } %></label>