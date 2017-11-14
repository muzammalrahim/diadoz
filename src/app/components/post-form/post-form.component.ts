import { DatePipe } from "@angular/common";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { DateAdapter, NativeDateAdapter } from "@angular/material";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { DataService } from "../../services/data.service";

import { Post } from "./post";

@Component({
  selector: "post-form",
  styleUrls: ["./forms.css"],
  templateUrl: "./post-form.component.html",
})
export class PostFormComponent implements OnInit, AfterViewInit {
    postTypes = ["Article", "Gallery"];
    mediaTypes = ["Video", "Image", "Tweet", "Other"];
    todayDate = new Date();
    submitted = false;
    model = new Post("", this.postTypes[0], "", "", this.todayDate, false, "", "", []);
    // headline, postType, featuredImage, customURL, publishDate, published, publishedBy, subHeadline, body
    media = {
        class: "media",
        title: "",
        embed: "",
        type: "",
        width: "",
    };
    artCard = {
        class: "card",
        title: "",
        primaryContributor: "",
        secondaryContributor: "",
        primaryType: "",
        summary: "",
        support: "",
        sources: [],
        contributingArtists: [],
    };
    source = "";
    artist = "";

    constructor(private dataService: DataService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params: Params) => {
            this.model.publishedBy = params.user;
            console.log(this.model.publishedBy + " is using the post form");
        });
    }
    
    onSubmit() {
        this.submitted = true;
        if (!this.model.customURL || this.model.customURL === "") {
            this.model.customURL = this.slugify(this.model.headline);
        }
    }

    sendData() {
        this.submitted = false;

        this.dataService.insertPost(this.model).subscribe((model) => {
            console.log(model);
            // redirect to when successful post
        });
        this.newPost();
    }

    newPost() {
        const today = new Date();
        this.model = new Post("", this.postTypes[0], "", "", today, false, this.model.publishedBy, "", []);
    }

    ngAfterViewInit() {
        tinymce.init({
            selector: "#tiny",
            plugins: ["link", "paste", "table"],
            skin_url: "assets/skins/lightgray",
            branding: false,
        });

    }

    toggleMedia(){
        const mediaDiv = document.getElementById("mediaData");
        mediaDiv.classList.toggle("hide");

        // hide all other toggled divs
        const bodyDiv = document.getElementById("bodyData");
        const artCardDiv = document.getElementById("artCardData");
        if (!artCardDiv.classList.contains("hide") || !bodyDiv.classList.contains("hide")){
            artCardDiv.classList.add("hide");
            bodyDiv.classList.add("hide");
        }
    }
    toggleArtCard(){
        const artCardDiv = document.getElementById("artCardData");
        artCardDiv.classList.toggle("hide");

        // hide all other toggled divs
        const bodyDiv = document.getElementById("bodyData");
        const mediaDiv = document.getElementById("mediaData");
        if (!bodyDiv.classList.contains("hide") || !mediaDiv.classList.contains("hide")){
            bodyDiv.classList.add("hide");
            mediaDiv.classList.add("hide");
        }
    }
    toggleBody(){
        const bodyDiv = document.getElementById("bodyData");
        bodyDiv.classList.toggle("hide");
        tinymce.activeEditor.setContent("");
        // hide all other toggled divs
        const artCardDiv = document.getElementById("artCardData");
        const mediaDiv = document.getElementById("mediaData");
        if (!artCardDiv.classList.contains("hide") || !mediaDiv.classList.contains("hide")){
            artCardDiv.classList.add("hide");
            mediaDiv.classList.add("hide");
        }
    }

    addSource(){
        this.artCard.sources.push(this.source);
        this.source = "";
    }
    addArtist(){
        this.artCard.contributingArtists.push(this.artist);
        this.artist = "";
    }

    addMedia(){
        this.model.body.push(this.media);
        this.toggleMedia();
        // clear media input
    }
    addArtCard(){
        this.model.body.push(this.artCard);
        this.toggleArtCard();
        // clear art card input
    }
    addBody(){
        this.model.body.push({
            class: "text",
            text: tinymce.activeEditor.getContent(),
        });
        this.toggleBody();

    }

    // TODO: Remove this when we're done
    get diagnostic() {
        return JSON.stringify(this.model);
    }

    private slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, "-")        // Replace spaces with -
            .replace(/[^\w\-]+/g, "")   // Remove all non-word chars
            .replace(/\-\-+/g, "-")      // Replace multiple - with single -
            .replace(/^-+/, "")          // Trim - from start of text
            .replace(/-+$/, "");         // Trim - from end of text
    }

}