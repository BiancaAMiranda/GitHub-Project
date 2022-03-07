import { Component, OnInit } from '@angular/core';
import { User } from '../users/users';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  user!: User;
  sorted = '0';
  constructor() {};

  changeSelect(){
    let sort = (<HTMLSelectElement>document.getElementById('select')).value;
    this.sorted = sort;
  }

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
        <div style="width: 50%; display: flex; justify-content: space-between; align-items: center; position: relative; right: 0; left: 0; margin-left: auto; margin-right:auto; margin-bottom: 3vh">
          <div style="width: 50%; display: flex; align-items: center; justify-content: center">
            <img style="height: 20vh; border-radius: 50%" src='${data.avatar_url}'>
          </div>
          <div style="width: 50%; display: flex; flex-direction: column; text-align: left; font-size: 0.9em; align-items: center; justify-content: center">
            <p> name: ${data.name} <br>
            login: ${data.login} <br>
            description: ${data.bio} <br>
            followers: ${data.followers} <br>
            following: ${data.following} <br>
            location: ${data.location} </p>
          </div>
        </div>
        <div align="center">
          <a target="_blanket" style="color: white;" href="https://github.com/${data.login}">
          <img height="180em" src="https://github-readme-stats.vercel.app/api?username=${data.login}&show_icons=true&theme=default&include_all_commits=true&count_private=true"/>
          <img height="180em" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${data.login}&layout=compact&langs_count=7&theme=default"/>
        </div>`;
        console.log(data.public_repos);
        if (data.public_repos > 0){
          fetch(`https://api.github.com/users/${data.login}/repos`).then((repos)=> repos.json()).then((repos_data) => {

            console.log(repos_data);
            document.getElementById('repos_title')!.innerHTML = `
            <h3 style="text-align: center">${data.login}'s Repositories</h3>`;

            if(this.sorted == '0'){
              repos_data.sort((a: { name: number; }, b: { name: number; }) => (a.name < b.name ? -1 : 1));

            } else if(this.sorted == '1'){
              repos_data.sort((a: { name: number; }, b: { name: number; }) => (a.name > b.name ? -1 : 1));
            } else if(this.sorted == '2'){
              repos_data.sort(function(a: { stargazers_count: number; }, b: { stargazers_count: number; }) {
                return a.stargazers_count - b.stargazers_count;
              });
            } else if (this.sorted == '3'){
              repos_data.sort(function(a: { stargazers_count: number; }, b: { stargazers_count: number; }) {
                return - a.stargazers_count + b.stargazers_count;
              });
            }

            if (data.public_repos <=30){
              let structures:string[] = [];

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
            }
            else if (data.public_repos > 30){
              let structures:string[] = [];

              for (let i:number = 0; i < 30; i++){
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
              document.getElementById('repos_list')!.innerHTML = `${structures.join(" <br>")}
              <a target="_blank" style="color: lightseagreen; margin-top: 2vh" href="https://github.com/${data.login}?tab=repositories"><p style="text-align: center;">More...</p></a>`;
            }
          }) 
        } 
        else{
          document.getElementById('repos_title')!.innerHTML = `
          <h3 style="text-align: center">O usuário ${data.login} does not have repositories!</h3>`;
          document.getElementById('repos_list')!.innerHTML = ``;
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