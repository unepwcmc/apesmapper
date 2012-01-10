<!-- report backbone template -->

<div class='multiselect_box'>
  <% var i, il;
  for(i=0, il=apes.length; i < il; i=i+1) { %>
    <input name="species" type="checkbox" value="<%= apes[i].code %>" id="ape_select_<%= apes[i].code %>">
    <label for="ape_select_<%= apes[i].code %>"><%= apes[i].taxa %><br/>
  <% } %>
</div>
<button id="create_work"><span class="button_info">Search</span></button>
