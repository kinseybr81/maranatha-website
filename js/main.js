if ("scrollRestoration" in history) {
	history.scrollRestoration = "manual";
}

window.addEventListener("load", function() {
	window.scrollTo(0, 0);
});

const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", function() {
	const isOpen = mainNav.classList.toggle("mobile-open");
	
	menuToggle.setAttribute("aria-expanded", isOpen.toString());
});

dropdownToggles.forEach(function(toggle) {
    const parent = toggle.parentElement;

    // Handle clicks
    toggle.addEventListener("click", function() {

        document.querySelectorAll(".has-dropdown.open").forEach(function(openDropdown) {
            if (openDropdown !== parent) {
                openDropdown.classList.remove("open");
				
				const button = openDropdown.querySelector(".dropdown-toggle");
				button.setAttribute("aria-expanded", "false");
            }
        });

        const isOpen = parent.classList.toggle("open");

		toggle.setAttribute("aria-expanded", isOpen.toString());
    });

    // Handle hovering onto another dropdown
    parent.addEventListener("mouseenter", function() {

        document.querySelectorAll(".has-dropdown.open").forEach(function(openDropdown) {
            if (openDropdown !== parent) {
                openDropdown.classList.remove("open");
				
				const button = openDropdown.querySelector(".dropdown-toggle");
				button.setAttribute("aria-expanded", "false");
            }
        });
		
		document.activeElement.blur();

    });
});

document.addEventListener("click", function(event) {

    // Close everything if the click/tap is outside the entire menu area
    if (!event.target.closest(".menu-wrapper")) {

        // Close the main navigation
        mainNav.classList.remove("mobile-open");
        menuToggle.setAttribute("aria-expanded", "false");

        // Close any open submenus
        document.querySelectorAll(".has-dropdown.open").forEach(function(openDropdown) {
            openDropdown.classList.remove("open");

            const button = openDropdown.querySelector(".dropdown-toggle");
            button.setAttribute("aria-expanded", "false");
        });

    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        document.querySelectorAll(".has-dropdown.open").forEach(function(openDropdown) {
            openDropdown.classList.remove("open");

            const button = openDropdown.querySelector(".dropdown-toggle");
            button.setAttribute("aria-expanded", "false");
			
			button.focus();
        });
    }
});

document.addEventListener("focusin", function(event) {
	
    document.querySelectorAll(".has-dropdown.open").forEach(function(openDropdown) {

        if (!openDropdown.contains(event.target)) {
            openDropdown.classList.remove("open");

            const button = openDropdown.querySelector(".dropdown-toggle");
            button.setAttribute("aria-expanded", "false");
        }
    });
});

const featuredSlider = document.querySelector(".featured-slider");

if (featuredSlider) {
	const featuredSlides = document.querySelectorAll(".featured-slide");
	const previousButton = document.querySelector(".slider-previous");
	const nextButton = document.querySelector(".slider-next");

	let currentSlide = 0;
	
	function showSlide(slideNumber) {
		featuredSlides.forEach(function(slide) {
				slide.classList.remove("active");
		});
			
		featuredSlides[slideNumber].classList.add("active");
	}
	
	nextButton.addEventListener("click", function() {
		currentSlide++;
		
		if (currentSlide >= featuredSlides.length) {
			currentSlide = 0;
		}
		
		showSlide(currentSlide);
		startSlideTimer();
	});
	
	previousButton.addEventListener("click", function() {
		currentSlide--;
		
		if (currentSlide < 0) {
			currentSlide = featuredSlides.length - 1;
		}
		
		showSlide(currentSlide);
		startSlideTimer();
	});
	
	let slideTimer;
	let isPaused = false;
	let userStartedPlayback = false;
	
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
		).matches;
	
	function startSlideTimer() {
		
		if(isPaused || (prefersReducedMotion && !userStartedPlayback)) {
			return;
		}
		
		clearTimeout(slideTimer);
		slideTimer = setTimeout(function() {
			currentSlide++;
				
			if (currentSlide >= featuredSlides.length) {
				currentSlide = 0;
			}
				
			showSlide(currentSlide);
				
			startSlideTimer();
		}, 6000);
	}
	
	const pauseButton = document.querySelector(".slider-pause");
	const pauseIcon = pauseButton.querySelector("span");
	
	if (prefersReducedMotion) {
		isPaused = true;
		pauseIcon.innerHTML = "&#9654;";
		pauseButton.setAttribute("aria-label", "Play featured items");
	}
	
	pauseButton.addEventListener("click", function() {
		isPaused = !isPaused;
		
		if (isPaused) {
			clearTimeout(slideTimer);
			pauseIcon.innerHTML = "&#9654;";
			pauseButton.setAttribute("aria-label", "Play featured items");
		} else {
			userStartedPlayback = true;
			pauseIcon.innerHTML = "&#10074;&#10074;";
			pauseButton.setAttribute("aria-label", "Pause featured items");
				
			startSlideTimer();
		}
	});
	
	featuredSlider.addEventListener("mouseenter", function() {
		clearTimeout(slideTimer);
	});

	featuredSlider.addEventListener("mouseleave", function() {
		startSlideTimer();
	});

	featuredSlider.addEventListener("focusin", function() {
		clearTimeout(slideTimer);
	});

	featuredSlider.addEventListener("focusout", function(event) {
		if (!featuredSlider.contains(event.relatedTarget)) {
			startSlideTimer();
		}
	});
	
	startSlideTimer();
}

const visitSection = document.querySelector(".visit");
const visitBackground = document.querySelector(".visit-background");

if (visitSection && visitBackground) {

    function updateVisitParallax() {
        const rect = visitSection.getBoundingClientRect();

        const movement = rect.top * -0.40;

        visitBackground.style.transform = `translateY(${movement}px)`;
    }

    window.addEventListener("scroll", updateVisitParallax);

    updateVisitParallax();
}

let sermonPlayer;

function onYouTubeIframeAPIReady() {
    console.log("YouTube IFrame API is ready.");

    sermonPlayer = new YT.Player("sermon-player", {
        events: {
            onReady: onSermonPlayerReady
        }
    });
}

function onSermonPlayerReady(event) {
    const sermonData = sermonPlayer.getVideoData();
	const sermonTitle = document.querySelector("#sermon-title");
    sermonTitle.textContent = sermonData.title;
}

const currentYear = document.querySelector("#current-year");

currentYear.textContent = new Date().getFullYear();

// =========================================
// SHARED FORM CONFIGURATION
// =========================================

const MBF_FORM_ENDPOINT =
    "https://maranatha-forms-api.kinseybr81.workers.dev/";
const MBF_BROWSER_ID_KEY = "mbfPrayerBrowserId";

function getMBFBrowserId() {
    let browserId;

    try {
        browserId = localStorage.getItem(MBF_BROWSER_ID_KEY);

        if (!browserId) {
            browserId = crypto.randomUUID();
            localStorage.setItem(MBF_BROWSER_ID_KEY, browserId);
        }
    } catch (error) {
        browserId = crypto.randomUUID();
    }

    return browserId;
}

function getMBFFormLoadedAt() {
    return Date.now();
}

function initializeMBFPhoneFormatter(phoneField) {
    if (!phoneField) return;

    function formatPhoneNumber() {
        const digits = phoneField.value.replace(/\D/g, "").slice(0, 10);

        let formatted = digits;

        if (digits.length > 6) {
            formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        } else if (digits.length > 3) {
            formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else if (digits.length === 3) {
            formatted = `(${digits}`;
        }

        phoneField.value = formatted;
    }

    phoneField.addEventListener("input", formatPhoneNumber);
    phoneField.addEventListener("change", formatPhoneNumber);
}

function initializeMBFCharacterCounter(messageField, countElement) {
    if (!messageField || !countElement) return;

    function updateCharacterCount() {
        countElement.textContent =
			`${messageField.value.length.toLocaleString()} / ${messageField.maxLength.toLocaleString()}`;
    }

    messageField.addEventListener("input", updateCharacterCount);

    updateCharacterCount();
}

function hideMBFFormMessages(successMessage, errorMessage) {
    if (successMessage) {
        successMessage.hidden = true;
    }

    if (errorMessage) {
        errorMessage.hidden = true;
    }
}

function showMBFFormMessage(messageElement, scrollTarget = messageElement) {
    if (!messageElement) return;

    messageElement.hidden = false;

    if (scrollTarget) {
        scrollTarget.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

const MBF_SUBMITTING_TEXT = "Submitting...";

function setMBFFormSubmitting(button, isSubmitting) {
    if (!button) return;

    if (!button.dataset.defaultText) {
        button.dataset.defaultText = button.textContent.trim();
    }

    button.disabled = isSubmitting;
    button.textContent = isSubmitting
        ? MBF_SUBMITTING_TEXT
        : button.dataset.defaultText;
}

function initializeMBFFormMessageHandlers(form, successMessage, errorMessage) {
    if (!form) return;

    function hideMessages() {
        hideMBFFormMessages(successMessage, errorMessage);
    }

    form.addEventListener("input", hideMessages);
    form.addEventListener("change", hideMessages);
}

async function submitMBFForm(formData) {
    const response = await fetch(MBF_FORM_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (
        !response.ok ||
        result.success !== true ||
        result.status !== "accepted"
    ) {
        throw new Error(
            "Form submission was not confirmed: " +
            (result.status || "unknown")
        );
    }

    return result;
}


// =========================================
// PRAYER REQUEST — FORM INITIALIZATION
// =========================================
const contactRequested = document.querySelector("#contact-requested");
const emailField = document.querySelector("#prayer-request-email");
const emailRequirement = document.querySelector("#email-requirement");
const prayerRequestContent = document.querySelector("#prayer-request-content");

if (contactRequested && emailField && emailRequirement) {
	contactRequested.addEventListener("change", function() {
		emailField.required = contactRequested.checked;

		if (contactRequested.checked) {
			emailRequirement.textContent = "(required):";
			emailRequirement.classList.remove("optional");
			emailRequirement.classList.add("required");
		} else {
			emailRequirement.textContent = "(optional):";
			emailRequirement.classList.remove("required");
			emailRequirement.classList.add("optional");
		}
	});
}

const prayerRequestForm = document.querySelector("#prayer-request-form");
const prayerFormSuccess = document.querySelector("#prayer-form-success");
const prayerFormError = document.querySelector("#prayer-form-error");
const prayerRequestField = document.querySelector("#prayer-request");
const prayerRequestCount = document.querySelector("#prayer-request-count");
const prayerCrisisAlert = document.querySelector("#prayer-crisis-alert");
const prayerViolenceAlert = document.querySelector("#prayer-violence-alert");
const prayerSubmitButton = prayerRequestForm?.querySelector(".form-submit");

const prayerFormLoadedAt = getMBFFormLoadedAt();

let prayerBrowserId = null;

if (prayerRequestForm) {
    prayerBrowserId = getMBFBrowserId();
}

if (prayerRequestForm && prayerFormSuccess && prayerFormError) {
    initializeMBFFormMessageHandlers(
        prayerRequestForm,
        prayerFormSuccess,
        prayerFormError
    );
}

if(prayerRequestForm) {
	prayerRequestForm.addEventListener("submit", function(event) {
		event.preventDefault();
		prayerFormError.hidden = true;
		prayerFormSuccess.hidden = true;
		const submitButton = prayerRequestForm.querySelector(".form-submit");
		
		if (submitButton.disabled) return;
		
		setMBFFormSubmitting(
			submitButton,
			true
		);
		
		const formData = {
			name: document.querySelector("#name").value.trim(),
			email: document.querySelector("#prayer-request-email").value.trim(),
			prayerRequest: document.querySelector("#prayer-request").value.trim(),
			confidential: document.querySelector("#confidential").checked,
			contactRequested: document.querySelector("#contact-requested").checked,
			website: document.querySelector("#company-website").value.trim(),
			formLoadedAt: prayerFormLoadedAt,
			browserId: prayerBrowserId
		};
		
		submitMBFForm(formData)
		.then(function() {
			// Preserve the entered information until delivery can be verified.
			setMBFFormSubmitting(
				submitButton,
				false
			);
			
			prayerFormSuccess.innerHTML = `
				<h3>Thank You for Sharing Your Prayer Request!</h3>
				<p>
					Your prayer request has been successfully submitted
					to Maranatha Baptist Fellowship.
					Thank you for allowing us to pray with you.
				</p>
				<p>
					If you requested someone to contact you,
					a member of our church leadership will follow up
					as soon as possible.
				</p>
			`;
			
			showMBFFormMessage(prayerFormSuccess, prayerRequestContent);
			console.log("Prayer request submitted.");
		})
		.catch(function(error) {
			setMBFFormSubmitting(
				submitButton,
				false
			);
			
			prayerFormError.innerHTML = `
				We couldn't submit your prayer request.
				Please try again or contact the church directly.
			
				<p>
					<strong>Phone:</strong>
					<a href="tel:7858628810"><strong>(785) 862-8810</strong></a>
				</p>
			
				<p>
					<strong>Email:</strong>
					<a href="mailto:info@mbftopeka.org"><strong>info@mbftopeka.org</strong></a>
				</p>
			`;

			showMBFFormMessage(prayerFormError, prayerRequestContent);
			console.error("Prayer request submission failed: ", error);
		});
	});
}

if (
    (prayerRequestField && prayerCrisisAlert && prayerViolenceAlert) ||
    (
        document.getElementById("contact-message") &&
        document.getElementById("contact-crisis-alert") &&
        document.getElementById("contact-violence-alert")
    )
) {
	const crisisPhrases = [
		"suicide",
		"suicidal",
		"kill myself",
		"killing myself",
		"end my life",
		"ending my life",
		"take my life",
		"taking my life",
		"hurt myself",
		"hurting myself",
		"harm myself",
		"harming myself",
		"self harm",
		"self-harm",
		"cut myself",
		"cutting myself",
		"don't want to live",
		"dont want to live",
		"don't want to be alive",
		"dont want to be alive",
		"wish i was dead",
		"wish i were dead",
		"better off dead",
		"no reason to live",
		"unalive",
		"un-alive",
		"un alive"
	];
	
	const violencePhrases = [
		"mass shooting",
		"school shooting",
		"workplace shooting",
		"church shooting",
		"shoot up",
		"shooting up",
		"kill someone",
		"kill somebody",
		"kill people",
		"killing someone",
		"killing somebody",
		"killing people",
		"murder someone",
		"murder somebody",
		"murder people",
		"hurt someone",
		"hurt somebody",
		"harm someone",
		"harm somebody",
		"shoot someone",
		"shoot somebody",
		"shoot people",
		"shoot them",
		"kill them",
		"murder them",
		"going to kill",
		"going to shoot",
		"plan to kill",
		"planning to kill",
		"plan to shoot",
		"planning to shoot",
		"want to kill",
		"want to shoot",
		"bomb the school",
		"bomb the church",
		"bomb the building"
	];
	
	const ambiguousViolencePhrases = [
		"want to kill",
		"going to kill",
		"planning to kill",
		"plan to kill"
	];
	
function containsMBFSafetyPhrase(text, phrases) {
    return phrases.some(function(phrase) {
        return text.includes(phrase);
    });
}

function updateMBFSafetyAlerts(crisisAlert, violenceAlert, crisisDetected, violenceDetected) {
    if (crisisAlert) {
        crisisAlert.hidden = !crisisDetected;
    }

    if (violenceAlert) {
        violenceAlert.hidden = !violenceDetected;
    }
}

function initializeMBFSafetyAlerts(messageField, crisisAlert, violenceAlert, crisisPhrases, violencePhrases) {
    if (!messageField || !crisisAlert || !violenceAlert) return;

    messageField.addEventListener("input", function() {
        const messageText = messageField.value
			.toLowerCase()
			.replace(/[.,!?;:]+/g, " ")
			.replace(/\s+/g, " ");

        const crisisDetected = containsMBFSafetyPhrase(
            messageText,
            crisisPhrases
        );
		
		const violenceDetected = violencePhrases.some(function(phrase) {
			if (!messageText.includes(phrase)) return false;
		
			if (!ambiguousViolencePhrases.includes(phrase)) {
				return true;
			}
		
			const selfHarmExpression = new RegExp(
				`${phrase}\\s+(myself|my own life)\\b`,
				"i"
			);
		
			return !selfHarmExpression.test(messageText);
		});

        updateMBFSafetyAlerts(
            crisisAlert,
            violenceAlert,
            crisisDetected,
            violenceDetected
        );
    });
}
	
initializeMBFSafetyAlerts(
	prayerRequestField,
	prayerCrisisAlert,
	prayerViolenceAlert,
	crisisPhrases,
	violencePhrases
);
	
	// CONTACT US — SAFETY PHRASE DETECTION

	const contactMessageField = document.getElementById("contact-message");
	const contactCrisisAlert = document.getElementById("contact-crisis-alert");
	const contactViolenceAlert = document.getElementById("contact-violence-alert");
	
	initializeMBFSafetyAlerts(
		contactMessageField,
		contactCrisisAlert,
		contactViolenceAlert,
		crisisPhrases,
		violencePhrases
	);
}

initializeMBFCharacterCounter(
    prayerRequestField,
    prayerRequestCount
);

if (prayerRequestForm && prayerRequestField && prayerSubmitButton) {

    function updatePrayerSubmitButton() {
		const prayerRequestIsValid =
			prayerRequestField.value.trim() !== "";
	
		const emailIsValid =
			!contactRequested.checked ||
			(emailField.value.trim() !== "" && emailField.checkValidity());
	
		prayerSubmitButton.disabled =
			!prayerRequestIsValid || !emailIsValid;
	}

    prayerRequestField.addEventListener("input", updatePrayerSubmitButton);
	emailField.addEventListener("input", updatePrayerSubmitButton);
	contactRequested.addEventListener("change", updatePrayerSubmitButton);

    updatePrayerSubmitButton();
}
document.querySelectorAll('a[href]').forEach(link => {

    const url = new URL(link.href, window.location.href);

    // Leave email, telephone, and other special links alone
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return;
    }

    const isExternal = url.origin !== window.location.origin;

    const isDocument = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|odt|ods|odp|rtf|txt)(?:$|[?#])/i.test(url.pathname);

    if (isExternal || isDocument) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }

});

/* =========================================
   Bible Translation Preferences
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
	// Convert Bible book names and abbreviations to API.Bible codes
	const bibleBooks = [
		['GEN', 'Genesis', 'Gen'],
		['EXO', 'Exodus', 'Exod', 'Exo', 'Ex'],
		['LEV', 'Leviticus', 'Lev'],
		['NUM', 'Numbers', 'Num'],
		['DEU', 'Deuteronomy', 'Deut', 'Deu'],
		['JOS', 'Joshua', 'Josh', 'Jos'],
		['JDG', 'Judges', 'Judg', 'Jdg'],
		['RUT', 'Ruth', 'Ruth'],
		['1SA', '1 Samuel', '1 Sam', '1Sam'],
		['2SA', '2 Samuel', '2 Sam', '2Sam'],
		['1KI', '1 Kings', '1 Kgs', '1Kgs'],
		['2KI', '2 Kings', '2 Kgs', '2Kgs'],
		['1CH', '1 Chronicles', '1 Chron', '1 Chr', '1Chron', '1Chr'],
		['2CH', '2 Chronicles', '2 Chron', '2 Chr', '2Chron', '2Chr'],
		['EZR', 'Ezra'],
		['NEH', 'Nehemiah', 'Neh'],
		['EST', 'Esther', 'Esth'],
		['JOB', 'Job'],
		['PSA', 'Psalms', 'Psalm', 'Ps', 'Psa'],
		['PRO', 'Proverbs', 'Prov', 'Pr'],
		['ECC', 'Ecclesiastes', 'Eccl'],
		['SNG', 'Song of Solomon', 'Song of Songs', 'Song', 'Song of Sol'],
		['ISA', 'Isaiah', 'Isa'],
		['JER', 'Jeremiah', 'Jer'],
		['LAM', 'Lamentations', 'Lam'],
		['EZK', 'Ezekiel', 'Ezek'],
		['DAN', 'Daniel', 'Dan'],
		['HOS', 'Hosea', 'Hos'],
		['JOL', 'Joel'],
		['AMO', 'Amos'],
		['OBA', 'Obadiah', 'Obad'],
		['JON', 'Jonah'],
		['MIC', 'Micah', 'Mic'],
		['NAM', 'Nahum', 'Nah'],
		['HAB', 'Habakkuk', 'Hab'],
		['ZEP', 'Zephaniah', 'Zeph'],
		['HAG', 'Haggai', 'Hag'],
		['ZEC', 'Zechariah', 'Zech'],
		['MAL', 'Malachi', 'Mal'],
		['MAT', 'Matthew', 'Matt', 'Mt'],
		['MRK', 'Mark', 'Mk'],
		['LUK', 'Luke', 'Lk'],
		['JHN', 'John', 'Jn'],
		['ACT', 'Acts'],
		['ROM', 'Romans', 'Rom'],
		['1CO', '1 Corinthians', '1 Cor', '1Cor'],
		['2CO', '2 Corinthians', '2 Cor', '2Cor'],
		['GAL', 'Galatians', 'Gal'],
		['EPH', 'Ephesians', 'Eph'],
		['PHP', 'Philippians', 'Phil', 'Php'],
		['COL', 'Colossians', 'Col'],
		['1TH', '1 Thessalonians', '1 Thess', '1Thess'],
		['2TH', '2 Thessalonians', '2 Thess', '2Thess'],
		['1TI', '1 Timothy', '1 Tim', '1Tim'],
		['2TI', '2 Timothy', '2 Tim', '2Tim'],
		['TIT', 'Titus', 'Tit'],
		['PHM', 'Philemon', 'Phlm'],
		['HEB', 'Hebrews', 'Heb'],
		['JAS', 'James', 'Jas'],
		['1PE', '1 Peter', '1 Pet', '1Pet'],
		['2PE', '2 Peter', '2 Pet', '2Pet'],
		['1JN', '1 John', '1 Jn', '1Jn'],
		['2JN', '2 John', '2 Jn', '2Jn'],
		['3JN', '3 John', '3 Jn', '3Jn'],
		['JUD', 'Jude'],
		['REV', 'Revelation', 'Rev']
	];
	
	const bibleBookLookup = new Map();
	
	bibleBooks.forEach(([code, ...names]) => {
		names.forEach(name => {
			bibleBookLookup.set(
				name.toLowerCase().replace(/[\s.]/g, ''),
				code
			);
		});
	});
	
	function getPassageId(link) {
		const url = new URL(link.href);
	
		// Example: Deut%204.1-2;csb
		const rawReference = decodeURIComponent(
			url.pathname.substring(1)
		).split(';')[0].trim();
	
		// Separate the book name from the chapter and verse
		const match = rawReference.match(
			/^(.+?)\s+(\d+)(?:\.(\d+))?(?:-(?:(\d+)\.)?(\d+))?$/
		);
	
		if (!match) return null;
	
		const [, bookName, chapter, verse, endChapter, endNumber] = match;
	
		const normalizedBook = bookName.toLowerCase().replace(/[\s.]/g, '');
		const bookCode = bibleBookLookup.get(normalizedBook);
	
		if (!bookCode) return null;
		// Books containing only one chapter
		const singleChapterBooks = new Set([
			'OBA', // Obadiah
			'PHM', // Philemon
			'2JN', // 2 John
			'3JN', // 3 John
			'JUD'  // Jude
		]);
		
		// Handle references such as 2 John 7-9 or Jude 3
		if (singleChapterBooks.has(bookCode) && !verse) {
			const startVerse = chapter;
		
			if (endNumber) {
				return `${bookCode}.1.${startVerse}-${bookCode}.1.${endNumber}`;
			}
		
			return `${bookCode}.1.${startVerse}`;
		}
		// Entire chapter
		if (!verse) {
			return `${bookCode}.${chapter}`;
		}
	
		const start = `${bookCode}.${chapter}.${verse}`;
	
		if (!endNumber) {
			return start;
		}
	
		// Cross-chapter or same-chapter range
		const finalChapter = endChapter || chapter;
		const end = `${bookCode}.${finalChapter}.${endNumber}`;
	
		return `${start}-${end}`;
	}

    const translationSelector = document.getElementById("bible-translation");

    // Exit if this page doesn't have the selector.
    if (!translationSelector) return;

    // Default translation: NASB 1995
    const defaultTranslation = "b8ee27bcd1cae43a-01";

    // Retrieve the visitor's saved preference.
    let savedTranslation = defaultTranslation;

    try {
        savedTranslation =
            localStorage.getItem("preferredBibleTranslation") || defaultTranslation;
    } catch (error) {
        // Continue using NASB 1995 if browser storage is unavailable.
    }

    // Restore the saved translation if it's available in the dropdown.
    const translationExists = Array.from(translationSelector.options)
        .some(option => option.value === savedTranslation);

    translationSelector.value = translationExists
        ? savedTranslation
        : defaultTranslation;

    // Save the visitor's choice whenever it changes.
    translationSelector.addEventListener("change", function () {

        try {
            localStorage.setItem(
                "preferredBibleTranslation",
                translationSelector.value
            );
        } catch (error) {
            // The selector still works if browser storage is unavailable.
        }

    });
	
	// Identify Scripture reference links
	const scriptureLinks = document.querySelectorAll(
		'a[href^="https://ref.ly/"]'
	);
	
	scriptureLinks.forEach(link => {
		link.classList.add('scripture-reference');
		link.setAttribute('data-scripture', link.textContent.trim());
	});
	
    // Scripture reference popup behavior
    const scripturePopup = document.getElementById('scripture-popup');

    if (scripturePopup) {
        const popupReference = scripturePopup.querySelector(
            '.scripture-popup-reference'
        );

        const popupText = scripturePopup.querySelector(
            '.scripture-popup-text'
        );
		
		const popupCopyright = scripturePopup.querySelector(
			'.scripture-popup-copyright'
		);

        let activeLink = null;
        let activeRequest = null;
		
		let hidePopupTimer = null;

		function hideScripturePopup() {
			clearTimeout(hidePopupTimer);
		
			activeLink = null;
			scripturePopup.hidden = true;
		
			if (activeRequest) {
				activeRequest.abort();
				activeRequest = null;
			}
		}
		
		// Keep the popup open while the mouse is inside it
		scripturePopup.addEventListener('mouseenter', () => {
			clearTimeout(hidePopupTimer);
		});
		
		// Close when the mouse leaves the popup
		scripturePopup.addEventListener('mouseleave', () => {
			hideScripturePopup();
		});

        // Keep the Scripture card inside the visible browser window
        function positionScripturePopup(link) {
            if (scripturePopup.hidden) return;

            const rect = link.getBoundingClientRect();
            const popupMargin = 10;
            const popupGap = 8;

            const popupWidth = scripturePopup.offsetWidth;
            const popupHeight = scripturePopup.offsetHeight;

            const spaceBelow =
                window.innerHeight - rect.bottom - popupMargin;

            const spaceAbove = rect.top - popupMargin;

            const openAbove =
                popupHeight > spaceBelow && spaceAbove > spaceBelow;

            let popupTop = openAbove
                ? rect.top - popupHeight - popupGap
                : rect.bottom + popupGap;

            popupTop = Math.max(
                popupMargin,
                Math.min(
                    popupTop,
                    window.innerHeight - popupHeight - popupMargin
                )
            );

            const popupLeft = Math.max(
                popupMargin,
                Math.min(
                    rect.left,
                    window.innerWidth - popupWidth - popupMargin
                )
            );

            scripturePopup.style.top = `${popupTop}px`;
            scripturePopup.style.left = `${popupLeft}px`;
        }

        scriptureLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
				clearTimeout(hidePopupTimer);
                // Cancel any previous Scripture request
                if (activeRequest) {
                    activeRequest.abort();
                }

                activeLink = link;
                activeRequest = null;

                popupReference.textContent = link.dataset.scripture;
                popupText.textContent = 'Loading Scripture...';
				popupCopyright.textContent = '';
				popupCopyright.hidden = true;

                scripturePopup.hidden = false;
                positionScripturePopup(link);

                const selectedBible =
                    document.getElementById('bible-translation')?.value
                    || 'b8ee27bcd1cae43a-01';

                const passageId = getPassageId(link);

                if (!passageId) {
                    popupText.textContent =
                        'Scripture reference could not be recognized.';

                    positionScripturePopup(link);
                    return;
                }

                const controller = new AbortController();
                activeRequest = controller;

                fetch(
                    `https://maranatha-bible-api.kinseybr81.workers.dev/passage?bibleId=${encodeURIComponent(selectedBible)}&passageId=${encodeURIComponent(passageId)}`,
                    { signal: controller.signal }
                )
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Unable to retrieve Scripture');
                        }

                        return response.json();
                    })
                    .then(data => {
                        if (activeLink !== link) return;

                        popupReference.textContent = data.reference;
						popupText.textContent = data.content;

						// Display the copyright information supplied by API.Bible
						if (data.copyright) {
							popupCopyright.textContent = data.copyright;
							popupCopyright.hidden = false;
						} else {
							popupCopyright.textContent = '';
							popupCopyright.hidden = true;
						}
						
						// Reposition after the passage and copyright have loaded
						positionScripturePopup(link);
                    })
                    .catch(error => {
                        if (error.name === 'AbortError') return;
                        if (activeLink !== link) return;

                        console.error(error);

                        popupText.textContent =
                            'Scripture could not be loaded.';

                        positionScripturePopup(link);
                    })
                    .finally(() => {
                        if (activeRequest === controller) {
                            activeRequest = null;
                        }
                    });
            });

            link.addEventListener('mouseleave', () => {
				if (activeLink !== link) return;
			
				// Allow time for the mouse to move into the Scripture card
				clearTimeout(hidePopupTimer);
			
				hidePopupTimer = setTimeout(() => {
					if (!scripturePopup.matches(':hover')) {
						hideScripturePopup();
					}
				}, 200);
			});
        });
    }

});


/* =========================================
   STATEMENT OF FAITH — CARD GENERATION
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const section = document.getElementById("foundations-of-faith");
    const grid = document.getElementById("beliefs-card-grid");
	let lastSelectedCard = null;
	const panel = document.getElementById("beliefs-reading-panel");
	const readingContent = document.getElementById("beliefs-reading-content");
	const backButton = document.getElementById("beliefs-back-button");

    // Only run on the Our Beliefs page.
    if (!section || !grid || !panel || !readingContent || !backButton) return;

    // Font Awesome icons for the 18 doctrinal articles.
    const beliefIcons = [
        ["fa-book-bible"],          // 1. The Scriptures
        ["fa-cross"],               // 2. God
        ["fa-user"],                // 3. Man
        ["fa-hand-holding-heart"],  // 4. Salvation
        ["fa-hands-praying"],       // 5. God's Purpose of Grace
        ["fa-church"],              // 6. The Church
        ["fa-droplet", "fa-wine-glass"], // 7. Baptism and Lord's Supper
        ["fa-sun"],                 // 8. The Lord's Day
        ["fa-crown"],               // 9. The Kingdom
        ["fa-hourglass-half"],      // 10. Last Things
        ["fa-earth-americas"],      // 11. Evangelism and Missions
        ["fa-graduation-cap"],      // 12. Education
        ["fa-hand-holding-dollar"], // 13. Stewardship
        ["fa-handshake"],           // 14. Cooperation
        ["fa-scale-balanced"],      // 15. Christian and Social Order
        ["fa-dove"],                // 16. Peace and War
        ["fa-landmark"],            // 17. Religious Liberty
        ["fa-people-roof"]          // 18. The Family
    ];

    // Find the existing doctrinal articles.
    const articles = section.querySelectorAll(
        "details.belief-item"
    );

    articles.forEach((article, index) => {

        const summary = article.querySelector("summary");
        if (!summary) return;

        const title = summary.textContent.trim();

        // Create an accessible, clickable card.
        const card = document.createElement("button");
        card.type = "button";
        card.className = "belief-card";

        // Create the icon container.
        const iconContainer = document.createElement("span");
        iconContainer.className = "belief-card-icons";
        iconContainer.setAttribute("aria-hidden", "true");

        const icons = beliefIcons[index] || ["fa-book-open"];

        icons.forEach(iconName => {
            const icon = document.createElement("i");
            icon.className = `fa-solid ${iconName}`;
            iconContainer.appendChild(icon);
        });

        // Create the card title.
        const titleElement = document.createElement("span");
        titleElement.className = "belief-card-title";
        titleElement.textContent = title;

        card.appendChild(iconContainer);
        card.appendChild(titleElement);
		
		// Add a subtle visual prompt.
		const readMore = document.createElement("span");
		readMore.className = "belief-card-read-more";
		readMore.innerHTML = 'Explore Belief <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';

		card.appendChild(readMore);

        // Open the selected article in the reading panel.
		card.addEventListener("click", () => {
		// Remember which card the visitor selected.
		lastSelectedCard = card;
		// Remove any previously displayed article.
		while (readingContent.firstChild) {
			const previousArticle = readingContent.firstChild;
		
			// Move the original article back to the beliefs section.
			section.appendChild(previousArticle);
		}
		
		// Display only the article associated with this card.
		readingContent.appendChild(article);
		article.open = true;
		
		// Show the bottom Back button only for long articles.
		const bottomBackButton = document.getElementById(
			"beliefs-back-button-bottom"
		);

		if (bottomBackButton) {
			// Wait for the article to finish rendering.
			requestAnimationFrame(() => {
				const articleHeight = article.getBoundingClientRect().height;
				const viewportHeight = window.innerHeight;

				bottomBackButton.hidden = articleHeight <= viewportHeight;
			});
		}

		// Hide the card grid and display the reading panel.
		grid.hidden = true;
		panel.hidden = false;
	
		// Bring the reading panel into view.
		panel.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	
		// Move keyboard focus to the Back button.
		backButton.focus({ preventScroll: true });
		});

        grid.appendChild(card);
    });
	
	// Return to the full card grid from either Back button.
	function returnToBeliefs() {
		panel.hidden = true;
		grid.hidden = false;
	
		grid.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	
		
		// Return keyboard focus to the previously selected card.
		if (lastSelectedCard) {
			lastSelectedCard.focus({ preventScroll: true });
		}

	}
	
	// Top Back button
	backButton.addEventListener("click", returnToBeliefs);
	
	// Bottom Back button
	const bottomButton = document.getElementById(
		"beliefs-back-button-bottom"
	);
	
	if (bottomButton) {
		bottomButton.addEventListener("click", returnToBeliefs);
	}

});

// =========================================
// CONTACT US — FORM INITIALIZATION
// =========================================

const contactForm = document.getElementById("contact-form");

initializeMBFPhoneFormatter(
    document.getElementById("contact-phone")
);

initializeMBFCharacterCounter(
    document.getElementById("contact-message"),
    document.getElementById("contact-message-count")
);

if (contactForm) {
    const contactSubmitButton = contactForm.querySelector(".form-submit");

    function updateContactSubmitButton() {
        const requiredFields = contactForm.querySelectorAll(
            "#contact-name, #contact-email, #contact-subject, #contact-message"
        );

        const allFieldsValid = Array.from(requiredFields).every(function(field) {
            return field.value.trim() !== "" && field.checkValidity();
        });

        contactSubmitButton.disabled = !allFieldsValid;
    }

    contactForm.addEventListener("input", updateContactSubmitButton);
    contactForm.addEventListener("change", updateContactSubmitButton);

    updateContactSubmitButton();
}

if (contactForm) {
    const contactFormLoadedAt = getMBFFormLoadedAt();
	
	initializeMBFFormMessageHandlers(
		contactForm,
		document.getElementById("contact-form-success"),
		document.getElementById("contact-form-error")
	);
	
	const contactBrowserId = getMBFBrowserId();

    contactForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton.disabled) return;

        const formData = {
            formType: "contact",
            name: document.getElementById("contact-name").value.trim(),
            email: document.getElementById("contact-email").value.trim(),
            phone: document.getElementById("contact-phone").value.trim(),
            subject: document.getElementById("contact-subject").value.trim(),
            message: document.getElementById("contact-message").value.trim(),
            website: document.getElementById("contact-website").value.trim(),
            formLoadedAt: contactFormLoadedAt,
            browserId: contactBrowserId
        };

        console.log("Contact Us form prepared for submission:", {
            formType: formData.formType,
            hasName: Boolean(formData.name),
            hasEmail: Boolean(formData.email),
            hasMessage: Boolean(formData.message)
        });

        // Submit the Contact Us message to Google Apps Script.
		setMBFFormSubmitting(
			submitButton,
			true
		);

		try {
			await submitMBFForm(formData);
			
				setMBFFormSubmitting(
					submitButton,
					false
				);

			console.log("Contact Us submission request completed.");
			
			const successMessage = document.getElementById("contact-form-success");

			if (successMessage) {
				successMessage.innerHTML = `
					Your message has been submitted for processing.
					If you do not receive a response, please contact the church directly.
					<p>
						<strong>Phone:</strong>
						<a href="tel:7858628810"><strong>(785) 862-8810</strong></a>
					</p>
					<p>
						<strong>Email:</strong>
						<a href="mailto:info@mbftopeka.org"><strong>info@mbftopeka.org</strong></a>
					</p>
				`;
				showMBFFormMessage(successMessage);
			}

		} catch (error) {
			console.error("Contact Us submission request failed.");

			const errorMessage = document.getElementById("contact-form-error");

			if (errorMessage) {
				errorMessage.innerHTML = `
					We couldn't submit your message. Please try again or contact the church directly.
					<p>
						<strong>Phone:</strong>
						<a href="tel:7858628810"><strong>(785) 862-8810</strong></a>
					</p>
					<p>
						<strong>Email:</strong>
						<a href="mailto:info@mbftopeka.org"><strong>info@mbftopeka.org</strong></a>
					</p>
				`;
				showMBFFormMessage(errorMessage);
			}
		
				setMBFFormSubmitting(
					submitButton,
					false
				);
		}
	});
}