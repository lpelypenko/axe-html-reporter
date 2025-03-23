export interface Resource {
    path: string;
    integrity?: string;
}

type StyleSheets = Resource[];
type Scripts = Resource[];

export const styleSheets: StyleSheets = [
    {
        path: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
        integrity: 'sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z'
    },
    {
        path: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/styles/stackoverflow-light.min.css',
    }
];

export const scripts: Scripts = [
    {
        path: 'https://code.jquery.com/jquery-3.2.1.slim.min.js',
        integrity: 'sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN'
    },
    {
        path: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
        integrity: 'sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q'
    },
    {
        path: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js',
        integrity: 'sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl'
    },
    {
        path: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/highlight.min.js',
    },
];
