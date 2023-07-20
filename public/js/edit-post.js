async function editFormHandler(event) {
    event.preventDefault();

    const model = document.querySelector('input[name="model"]').value.trim();
    const issue = document.querySelector('input[name="issue"]').value.trim();
    console.log(model);
    console.log(issue);

    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
      
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          post_id: id,
          model,
          issue
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        document.location.replace('/userdash/');
      } else {
        alert(response.statusText);
      }

}

document.querySelector('#edit-post-form').addEventListener('submit', editFormHandler);