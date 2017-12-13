Acme.Controller.JobFormPage = function (blogid) {
	window.Acme.cards = CardController();
	Acme.jobForm = new Acme.JobForm([blogid], 'Single Job Listing');
	Acme.listingView.init(blogid, 'job');
	Acme.listingCollection = new Acme.listingCollectionClass('listingCollection', blogid);
};
