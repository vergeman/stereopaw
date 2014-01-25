require 'spec_helper'

describe "Root Page" do

  describe "Visits '/' page" do

    before {
      visit root_path()
    }

    describe "[Navigation]" do

      #--Sidebar --#
      describe "Sidebar" do 
        it "in sidebar element nav" do
          page.should have_css("div#sidebar > nav")
        end
        
        #requried for further tests
        it "is an unordered list (ul)" do
          page.should have_css("div#sidebar > nav > ul")
        end
      end

      #--Topbar--#
      describe "Topbar" do
        it "has a topbar nav" do
          page.should have_css("div#topbar > nav")
        end

        it "is an unordered list (ul)" do
          page.should have_css("div#topbar > nav > ul")
        end

        it "has a title" do
          page.should have_selector("div#topbar > nav > ul > li.name > h1 > a", text: "SpinClip")
        end

        it "has a menu item" do
          page.should have_selector("ul.title-area > li.toggle-topbar.menu-icon > a", text: "MENU")
        end

        it "has a top-bar-section" do
          page.should have_css("section.top-bar-section")
        end

        it "with the class 'hidden for large up ' " do
          page.should have_selector("section.top-bar-section > ul.hidden-for-large-up")
        end

      end


      describe "both lists have navigation elements" do 
        
        #setup our navbar elements
        @navbar = [
                   {
                     :content => 'Tracks',
                     :div => '#links'
                   },
                   {
                     :content => 'Playlists',
                     :div => '#playlist'
                   },
                   {
                     :content => 'New',
                     :div => '#new'
                   },
                   {
                     :content => 'Popular',
                     :div => '#popular'
                   },
                   {
                     :content => 'Submit',
                     :div => '#submit'
                   },
                   {
                     :content => 'Settings',
                     :div => '#settings'
                   }
                  ]

        #loop and test sidebar & navbar
        @navbar.each do | e |

          it "sidebar w/ a list element with id #{e[:div]}" do
            page.should have_css("div#sidebar > nav > ul > li" + e[:div])
          end

          it "sidebar with content #{e[:content]}" do
            page.should have_selector("div#sidebar > nav > ul > li" +e[:div], text: e[:content])

          end


          it "topbar with content #{e[:content]}" do
            page.should have_selector("section.top-bar-section > ul.hidden-for-large-up > li" +e[:div], text: e[:content])
          end


        end


      end





    end #end Navigation

  end #end visits

end
