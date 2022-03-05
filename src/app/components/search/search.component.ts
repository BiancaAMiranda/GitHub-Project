import { Component, OnInit } from '@angular/core';
import { User } from '../users/users';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  user!: User;
  constructor() {}

  ngOnInit() {
    this.user = new User();
  };

  onSubmit() {
    fetch(`https://api.github.com/users/${this.user.user}`).then((searched)=> searched.json()).then((data) => {
      if (data.message){
        document.getElementById('searched')!.innerHTML = `<p style="font-size: 2em; color: red; text-align: center">user not found<p>`;
        document.getElementById('repos_title')!.innerHTML = ``;
        document.getElementById('repos_list')!.innerHTML = ``;
      } else{
        document.getElementById('searched')!.innerHTML = `
        <div style="width: 40%; display: flex; justify-content: space-between; align-items: center; position: relative; right: 0; left: 0; margin: auto; " >
          <img style="height: 25vh; border-radius: 50%" src='${data.avatar_url}'>
          <div style="text-align: left; font-size: 0.9em">
            <p> name: ${data.name} </p>
            <p>login: ${data.login} </p>
            <p>description: ${data.bio} </p>
            <p>followers: ${data.followers} </p>
            <p>following: ${data.following} </p>
            <p>location: ${data.location} </p>
          </div>
        </div>
        <div align="center">
          <a target="_blanket" style="color: white;" href="https://github.com/${data.login}">
          <img height="180em" src="https://github-readme-stats.vercel.app/api?username=${data.login}&show_icons=true&theme=default&include_all_commits=true&count_private=true"/>
          <img height="180em" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${data.login}&layout=compact&langs_count=7&theme=default"/>
        </div>`;
        if (data.public_repos > 0){
          fetch(`https://api.github.com/users/${data.login}/repos`).then((repos)=> repos.json()).then((repos_data) => {

            document.getElementById('repos_title')!.innerHTML = `
            <h3 style="text-align: center">${data.login}'s Repositories</h3>`;

            let structures:string[] = [];
            console.log(structures);
            for (let i:number = 0; i < data.public_repos; i++){
              structures.push(`
              <section>
                <div>
                  <a target="_blanket" style="color: lightseagreen;" href="${repos_data[i].html_url}">
                    <h3>${repos_data[i].name}</h3>
                  </a>
                </div>
                <div>
                  <p>${repos_data[i].description}</p>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between">
                  <p>${repos_data[i].language}</p>
                  <p>☆ ${repos_data[i].stargazers_count}</p>
                  <p>Update on ${repos_data[i].updated_at}</p>
                </div>
              </section>`,
              )
            };
            document.getElementById('repos_list')!.innerHTML = `${structures.join(" <br>")}`;
          })
        }
      }
    }).catch(function(error) {
      document.getElementById('searched')!.innerHTML = `${error.message} : ERR_INTERNET_DISCONNECTED`
      document.getElementById('repos_title')!.innerHTML = ``;
      document.getElementById('repos_list')!.innerHTML = ``;
    });
    this.user = new User();
  }
};